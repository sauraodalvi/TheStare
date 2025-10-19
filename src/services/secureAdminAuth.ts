import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

/**
 * Secure Admin Authentication Service
 * Uses Supabase for server-side authentication and session management
 */

export class SecureAdminAuth {
  private static readonly ADMIN_ROLE = 'admin';
  private static readonly ADMIN_EMAIL_DOMAIN = 'getstare.com'; // Change this to your admin domain
  private static readonly SESSION_DURATION = 8 * 60 * 60; // 8 hours in seconds

  /**
   * Check if current user is an admin
   */
  static async isAdmin(): Promise<boolean> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        return false;
      }

      // Get user's full profile
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user profile:', userError);
        return false;
      }

      // Check if user has admin role and verified email
      return userData.role === this.ADMIN_ROLE && 
             session.user.email?.endsWith(`@${this.ADMIN_EMAIL_DOMAIN}`) &&
             session.user.email_confirmed_at !== null;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }

  /**
   * Sign in admin with email and password
   */
  static async signIn(email: string, password: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        console.error('Admin sign in error:', error);
        toast.error(error?.message || 'Failed to sign in');
        return false;
      }

      // Verify admin role after successful sign in
      const isAdmin = await this.isAdmin();
      if (!isAdmin) {
        await this.signOut();
        toast.error('Access denied. Admin privileges required.');
        return false;
      }

      toast.success('Admin access granted');
      return true;
    } catch (error) {
      console.error('Admin sign in error:', error);
      toast.error('An unexpected error occurred');
      return false;
    }
  }

  /**
   * Sign out admin
   */
  static async signOut(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  }

  /**
   * Get current admin session
   */
  static async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return data.session;
  }

  /**
   * Get current admin user
   */
  static async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    return user;
  }
}
