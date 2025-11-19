import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Server-side only admin client
export const createAdminClient = () => {
  // Only allow this on the server
  if (typeof window !== 'undefined') {
    throw new Error('Admin client should only be used on the server');
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing required environment variables for admin client. ' +
      'Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set in your .env file.'
    );
  }

  // Create a separate instance for admin operations
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        'X-Client-Info': 'stare-revived-ui/admin',
      },
    },
  });
};

// Helper to check if admin client is properly configured
export const isAdminConfigured = () => {
  return !!(
    process.env.VITE_SUPABASE_URL &&
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
  );
};

// This ensures we don't accidentally use the admin client on the client-side
export const getAdminClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client cannot be used in the browser');
  }
  // This will fail at runtime if env vars are missing, which is good
  return createAdminClient();
};

// Type guard to check if user is admin
export const isAdmin = (user: any): boolean => {
  return user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';
};

// Secure admin operations
export const adminOnly = <T extends (...args: any[]) => any>(
  fn: T
): ((...args: Parameters<T>) => ReturnType<T> | never) => {
  return (...args: Parameters<T>): ReturnType<T> | never => {
    const [context] = args;
    if (!context?.user || !isAdmin(context.user)) {
      throw new Error('Unauthorized: Admin access required');
    }
    return fn(...args);
  };
};
