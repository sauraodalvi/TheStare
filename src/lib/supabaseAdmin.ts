import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Admin Supabase client with service_role key for admin operations
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Helper function to check if admin client is properly configured
export const isAdminConfigured = (): boolean => {
  return !!supabaseServiceRoleKey;
};

// Create a safe fallback that throws descriptive errors only when used
const createUnsafeFallback = () => {
  const error = new Error(
    'Supabase admin client is not properly configured. Please set VITE_SUPABASE_SERVICE_ROLE_KEY in your .env (do NOT expose service role key in production).'
  );
  return new Proxy(supabase, {
    get(target, prop) {
      // Allow access to all regular supabase methods
      if (prop in target) {
        return target[prop as keyof typeof target];
      }
      // For admin-specific methods, throw error
      if (prop === 'auth' || prop === 'from') {
        throw error;
      }
      return undefined;
    }
  }) as typeof supabase & {
    auth: {
      admin: any;
    };
  };
};

// Create admin client when configured; otherwise export safe fallback
export const supabaseAdmin = isAdminConfigured()
  ? (() => {
      // Create a proxy that adds admin methods to the existing client
      return new Proxy(supabase, {
        get(target, prop) {
          // For admin auth, return a new client with service role
          if (prop === 'auth') {
            return {
              ...target.auth,
              admin: createClient(supabase.supabaseUrl, supabaseServiceRoleKey!, {
                auth: {
                  autoRefreshToken: false,
                  persistSession: false,
                },
              }).auth
            };
          }
          return target[prop as keyof typeof target];
        }
      }) as typeof supabase & {
        auth: typeof supabase.auth & {
          admin: any;
        };
      };
    })()
  : createUnsafeFallback();

// Log configuration status
console.log('🔧 Supabase Admin Client Configuration:');
console.log('- Admin Mode:', isAdminConfigured() ? '✅ Enabled' : '⚠️ Disabled (service role key not found)');
