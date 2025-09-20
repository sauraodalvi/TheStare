import { createClient } from '@supabase/supabase-js';

// Admin Supabase client with service_role key for admin operations
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Helper function to check if admin client is properly configured
export const isAdminConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseServiceRoleKey);
};

// Create a safe fallback that throws descriptive errors only when used
const createUnsafeFallback = () => {
  const error = new Error(
    'Supabase admin client is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY in your .env (do NOT expose service role key in production).'
  );
  return {
    from: () => { throw error; },
    auth: {
      admin: new Proxy({}, {
        get() { throw error; }
      })
    }
  } as unknown as ReturnType<typeof createClient>;
};

// Create admin client when configured; otherwise export safe fallback
export const supabaseAdmin = isAdminConfigured()
  ? createClient(supabaseUrl!, supabaseServiceRoleKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : createUnsafeFallback();

// Log configuration status (without exposing keys)
console.log('🔧 Supabase Admin Client Configuration:');
console.log('- URL:', supabaseUrl ? '✅ Configured' : '❌ Missing');
console.log('- Service Role Key:', supabaseServiceRoleKey ? '✅ Configured' : '❌ Missing');
