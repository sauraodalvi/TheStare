import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Debug flag
const DEBUG = import.meta.env.DEV;

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create a single instance of the Supabase client for the entire application
// This ensures we only have one instance of the client, even with HMR
let supabaseInstance: SupabaseClient<Database> | null = null;
let adminInstance: SupabaseClient<Database> | null = null;

// Global key to store the Supabase client in the browser's window object
const GLOBAL_SUPABASE_KEY = '__SUPABASE_CLIENT__';

/**
 * Get or create the Supabase client instance
 * This ensures we only have one instance of the client, even with HMR
 */
function createSupabaseClient() {
  // In the browser, we'll store the client in the window object
  // to persist it across hot reloads
  if (typeof window !== 'undefined') {
    if (!window[GLOBAL_SUPABASE_KEY]) {
      window[GLOBAL_SUPABASE_KEY] = _createClient();
    }
    return window[GLOBAL_SUPABASE_KEY];
  }

  // On the server, we'll use a module-level variable
  if (!supabaseInstance) {
    supabaseInstance = _createClient();
  }
  return supabaseInstance;
}

/**
 * Internal function to create a new Supabase client
 */
function _createClient() {
  if (DEBUG) {
    console.log('Creating new Supabase client instance');
  }

  const isBrowser = typeof window !== 'undefined';

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: isBrowser,
      ...(isBrowser && {
        storage: {
          getItem: (key) => window.localStorage.getItem(key),
          setItem: (key, value) => window.localStorage.setItem(key, value),
          removeItem: (key) => window.localStorage.removeItem(key),
        },
      }),
    },
  });
}

// Export the Supabase client
export const supabase = createSupabaseClient();

// Type exports
export type { User };
export * from '@supabase/supabase-js';

// For debugging
if (DEBUG) {
  console.log('Supabase client initialized');
}

// Clean up function for hot module replacement in development
if (import.meta.hot) {
  // Keep the existing client instance during HMR
  import.meta.hot.accept();

  // Clean up when the module is disposed
  import.meta.hot.dispose(() => {
    // We don't clean up the client instance to maintain the single instance
  });
}

// Declare the global window type for TypeScript
declare global {
  interface Window {
    [GLOBAL_SUPABASE_KEY]: SupabaseClient<Database>;
  }
}
