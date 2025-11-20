import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function enableRLSOnAllTables() {
  console.log('🔐 Enabling RLS on all tables...');
  
  const { data: tables, error } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');

  if (error) {
    console.error('Error fetching tables:', error);
    return;
  }

  for (const { tablename } of tables || []) {
    if (['spatial_ref_sys', 'geography_columns', 'geometry_columns'].includes(tablename)) {
      continue; // Skip system tables
    }

    console.log(`  Enabling RLS on table: ${tablename}`);
    const { error: rlsError } = await supabase
      .rpc('enable_rls_on_table', { table_name: tablename });

    if (rlsError) {
      console.warn(`    Warning: ${rlsError.message}`);
    }
  }
}

async function createSecurityFunctions() {
  console.log('🛡️ Creating security functions...');
  
  const functions = [
    // Check if current user is an admin
    `
    CREATE OR REPLACE FUNCTION is_admin()
    RETURNS boolean AS $$
    BEGIN
      RETURN EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid()
        AND (raw_user_meta_data->>'is_admin')::boolean = true
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `,
    
    // Check if user can access a specific user's data
    `
    CREATE OR REPLACE FUNCTION can_access_user(target_user_id uuid)
    RETURNS boolean AS $$
    BEGIN
      RETURN (
        -- Users can access their own data
        target_user_id = auth.uid()
        -- Or if they're an admin
        OR is_admin()
      );
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
  ];

  for (const sql of functions) {
    const { error } = await supabase.rpc('sql', { query: sql });
    if (error) {
      console.warn(`  Warning creating function: ${error.message}`);
    }
  }
}

async function setupPolicies() {
  console.log('🔒 Setting up security policies...');
  
  // Example policy setup for a 'profiles' table
  const policies = [
    // Profiles table policies
    `
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    CREATE POLICY "Users can view their own profile"
    ON public.profiles
    FOR SELECT
    USING (can_access_user(id));
    `,
    
    `
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    CREATE POLICY "Users can update their own profile"
    ON public.profiles
    FOR UPDATE
    USING (can_access_user(id));
    `,
    
    // Add more table policies as needed
  ];

  for (const policy of policies) {
    const { error } = await supabase.rpc('sql', { query: policy });
    if (error) {
      console.warn(`  Warning applying policy: ${error.message}`);
    }
  }
}

async function main() {
  try {
    await enableRLSOnAllTables();
    await createSecurityFunctions();
    await setupPolicies();
    
    console.log('✅ Database security configuration completed successfully!');
  } catch (error) {
    console.error('❌ Error configuring database security:', error);
    process.exit(1);
  }
}

main();
