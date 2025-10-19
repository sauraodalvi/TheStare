import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Initialize Supabase admin client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function configureSecurity() {
  try {
    console.log('Configuring Supabase security settings...');

    // 1. Enable RLS on all tables
    await enableRLSOnAllTables();
    
    // 2. Configure auth settings
    await configureAuthSettings();
    
    // 3. Configure CORS
    await configureCORS();
    
    console.log('Security configuration completed successfully!');
  } catch (error) {
    console.error('Error configuring security:', error);
    process.exit(1);
  }
}

async function enableRLSOnAllTables() {
  console.log('Enabling RLS on all tables...');
  
  // Get all tables in the public schema
  const { data: tables, error } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');

  if (error) throw error;

  // Enable RLS on each table
  for (const { tablename } of tables || []) {
    console.log(`Enabling RLS on table: ${tablename}`);
    const { error: rlsError } = await supabase.rpc('enable_rls_on_table', {
      table_name: tablename,
    });
    
    if (rlsError && !rlsError.message.includes('already has row security')) {
      console.warn(`  Warning: Could not enable RLS on ${tablename}:`, rlsError.message);
    }
  }
}

async function configureAuthSettings() {
  console.log('Configuring auth settings...');
  
  // Set session timeout to 1 hour (3600 seconds)
  const { error: sessionError } = await supabase
    .rpc('set_auth_config', {
      key: 'session_timeout',
      value: '3600',
    });
  
  if (sessionError) console.warn('  Warning: Could not set session timeout:', sessionError.message);
  
  // Enable email confirmation
  const { error: confirmError } = await supabase
    .rpc('update_auth_config', {
      key: 'email_confirmation',
      value: 'true',
    });
  
  if (confirmError) console.warn('  Warning: Could not configure email confirmation:', confirmError.message);
}

async function configureCORS() {
  console.log('Configuring CORS...');
  
  const allowedOrigins = [
    'https://yourdomain.com',
    'https://www.yourdomain.com',
    'http://localhost:3000',
    'http://localhost:5173',
  ];
  
  const { error } = await supabase
    .rpc('update_cors_config', {
      allowed_origins: allowedOrigins,
      allowed_methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowed_headers: ['Content-Type', 'Authorization'],
      allow_credentials: true,
    });
  
  if (error) console.warn('  Warning: Could not configure CORS:', error.message);
}

// Run the configuration
configureSecurity();
