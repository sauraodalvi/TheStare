// Re-export the supabase client from integrations to avoid multiple instances
// This prevents the "Multiple GoTrueClient instances" warning
import { supabase } from '@/integrations/supabase/client';
export { supabase };

// Helper function to get the current session
export const getCurrentSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Helper function to sign out
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
    throw error;
  }
};

// Export types for better TypeScript support
export type { User, Session } from '@supabase/supabase-js';
