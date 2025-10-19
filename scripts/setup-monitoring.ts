import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Initialize Supabase
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

async function setupMonitoring() {
  try {
    console.log('Setting up monitoring...');
    
    // Create audit logs table if it doesn't exist
    await createAuditLogsTable();
    
    // Create error tracking table
    await createErrorTrackingTable();
    
    // Set up database triggers for important events
    await setupDatabaseTriggers();
    
    console.log('Monitoring setup completed successfully!');
  } catch (error) {
    console.error('Error setting up monitoring:', error);
    process.exit(1);
  }
}

async function createAuditLogsTable() {
  console.log('Creating audit logs table...');
  
  const { error } = await supabase.rpc('execute_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS public.audit_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        action TEXT NOT NULL,
        table_name TEXT,
        record_id UUID,
        old_data JSONB,
        new_data JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      -- Enable RLS
      ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
      
      -- Only admins can read audit logs
      DROP POLICY IF EXISTS "Enable read access for admins" ON public.audit_logs;
      CREATE POLICY "Enable read access for admins" 
        ON public.audit_logs 
        FOR SELECT 
        USING (auth.uid() IN (
          SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
        ));
    `,
  });
  
  if (error) throw error;
}

async function createErrorTrackingTable() {
  console.log('Creating error tracking table...');
  
  const { error } = await supabase.rpc('execute_sql', {
    query: `
      CREATE TABLE IF NOT EXISTS public.error_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
        error_name TEXT NOT NULL,
        error_message TEXT NOT NULL,
        error_stack TEXT,
        url TEXT,
        component_stack TEXT,
        user_agent TEXT,
        ip_address INET,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      
      -- Enable RLS
      ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;
      
      -- Only admins can read error logs
      DROP POLICY IF EXISTS "Enable read access for admins" ON public.error_logs;
      CREATE POLICY "Enable read access for admins" 
        ON public.error_logs 
        FOR SELECT 
        USING (auth.uid() IN (
          SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
        ));
    `,
  });
  
  if (error) throw error;
}

async function setupDatabaseTriggers() {
  console.log('Setting up database triggers...');
  
  // Create a function to log changes to the audit_logs table
  const { error: functionError } = await supabase.rpc('execute_sql', {
    query: `
      CREATE OR REPLACE FUNCTION log_audit_event()
      RETURNS TRIGGER AS $$
      DECLARE
        user_id UUID;
        user_agent TEXT;
        ip_address INET;
      BEGIN
        -- Get the current user ID from the JWT
        BEGIN
          user_id := auth.uid();
        EXCEPTION WHEN OTHERS THEN
          user_id := NULL;
        END;
        
        -- Get the user agent and IP address from the request
        BEGIN
          user_agent := current_setting('request.headers', true)::json->>'user-agent';
        EXCEPTION WHEN OTHERS THEN
          user_agent := NULL;
        END;
        
        BEGIN
          ip_address := current_setting('request.headers', true)::json->>'x-forwarded-for';
        EXCEPTION WHEN OTHERS THEN
          ip_address := NULL;
        END;
        
        -- Insert the audit log
        IF (TG_OP = 'DELETE') THEN
          INSERT INTO public.audit_logs (
            user_id, 
            action, 
            table_name, 
            record_id, 
            old_data, 
            ip_address, 
            user_agent
          ) VALUES (
            user_id,
            TG_OP,
            TG_TABLE_NAME,
            OLD.id,
            to_jsonb(OLD),
            ip_address,
            user_agent
          );
          RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
          INSERT INTO public.audit_logs (
            user_id, 
            action, 
            table_name, 
            record_id, 
            old_data, 
            new_data,
            ip_address, 
            user_agent
          ) VALUES (
            user_id,
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(OLD),
            to_jsonb(NEW),
            ip_address,
            user_agent
          );
          RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
          INSERT INTO public.audit_logs (
            user_id, 
            action, 
            table_name, 
            record_id, 
            new_data,
            ip_address, 
            user_agent
          ) VALUES (
            user_id,
            TG_OP,
            TG_TABLE_NAME,
            NEW.id,
            to_jsonb(NEW),
            ip_address,
            user_agent
          );
          RETURN NEW;
        END IF;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `,
  });
  
  if (functionError) {
    console.error('Error creating audit log function:', functionError);
    return;
  }
  
  // Get all tables in the public schema
  const { data: tables, error: tablesError } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');
  
  if (tablesError) {
    console.error('Error getting tables:', tablesError);
    return;
  }
  
  // Create triggers for each table
  for (const { tablename } of tables || []) {
    if (['audit_logs', 'error_logs', 'migrations', 'schema_migrations'].includes(tablename)) {
      continue; // Skip system tables
    }
    
    console.log(`Creating trigger for table: ${tablename}`);
    
    const { error: triggerError } = await supabase.rpc('execute_sql', {
      query: `
        DROP TRIGGER IF EXISTS ${tablename}_audit_trigger ON public.${tablename};
        CREATE TRIGGER ${tablename}_audit_trigger
        AFTER INSERT OR UPDATE OR DELETE ON public.${tablename}
        FOR EACH ROW EXECUTE FUNCTION log_audit_event();
      `,
    });
    
    if (triggerError) {
      console.warn(`  Warning: Could not create trigger for ${tablename}:`, triggerError.message);
    }
  }
}

// Run the setup
setupMonitoring();
