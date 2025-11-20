/**
 * Admin Authentication Service
 * Handles environment variable-based admin authentication with sessionStorage
 */

import { supabase } from '@/integrations/supabase/client';

export class AdminAuthService {
  /**
   * Check if current user is an admin
   */
  static async isAdmin(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;

      // Check for admin role in user metadata
      return user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Authenticate is now handled by Supabase Auth UI
   * This method is kept for compatibility but logs a warning
   */
  static async authenticate(password: string): Promise<boolean> {
    console.warn('Password-based admin auth is deprecated. Please use Supabase Auth.');
    return false;
  }

  /**
   * Check if current session is valid
   */
  static async isAuthenticated(): Promise<boolean> {
    return this.isAdmin();
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
}
