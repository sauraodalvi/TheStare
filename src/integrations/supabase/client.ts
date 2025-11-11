import { createClient, type User, type Session, type AuthChangeEvent } from '@supabase/supabase-js';
import type { Database } from './types';

type TableName = keyof Database['public']['Tables'];

// Global instance to ensure single client
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

class SecureSupabaseClient {
  private client: ReturnType<typeof createClient<Database>>;

  constructor() {
    if (supabaseInstance) {
      this.client = supabaseInstance;
      return;
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your .env file.'
      );
    }

    this.client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        fetch: (url: string, options: RequestInit = {}) => {
          const headers = new Headers(options.headers);
          headers.set('X-Requested-With', 'XMLHttpRequest');
          headers.set('X-Client-Info', 'stare-revived-ui/1.0');
          
          return fetch(url, {
            ...options,
            headers,
          });
        },
      },
    });

    // Store the instance globally
    supabaseInstance = this.client;
  }

  // Type-safe table access
  from<T extends TableName>(table: T) {
    return this.client.from(table);
  }

  // Auth methods
  get auth() {
    return this.client.auth;
  }

  // User management
  async getUser() {
    const { data: { user }, error } = await this.client.auth.getUser();
    if (error) throw error;
    return user;
  }

  async getSession() {
    const { data: { session }, error } = await this.client.auth.getSession();
    if (error) throw error;
    return session;
  }

  // Security helpers
  async isAdmin(user?: User | null): Promise<boolean> {
    const currentUser = user || (await this.getUser());
    return currentUser?.user_metadata?.role === 'admin' || false;
  }

  // Secure data access
  async withUserCheck<T>(
    userId: string, 
    callback: (user: User) => Promise<T>
  ): Promise<T> {
    const user = await this.getUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }
    
    if (user.id !== userId && !(await this.isAdmin(user))) {
      throw new Error('Unauthorized access');
    }
    
    return callback(user);
  }

  // Subscribe to auth state changes
  onAuthStateChange(
    callback: (event: AuthChangeEvent, session: Session | null) => void
  ) {
    return this.client.auth.onAuthStateChange(callback);
  }
}

// Export a singleton instance
export const supabase = new SecureSupabaseClient();

// For backward compatibility
export const secureSupabase = supabase;