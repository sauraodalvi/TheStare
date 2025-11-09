import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

/**
 * Secure Admin Authentication Service
 * Uses Supabase RLS and JWT for secure role-based authentication
 */

export class AdminAuthService {
  private static readonly ADMIN_SESSION_KEY = 'secure_admin_session';
  private static readonly SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours
  private static readonly ROLE_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  /**
   * Check if current user has admin role
   */
  static async isAdmin(): Promise<boolean> {
    try {
      // Check session first
      const session = this.getSession();
      if (!session) return false;
      
      // Check if session is expired
      if (Date.now() > session.expires) {
        this.clearSession();
        return false;
      }

      // Periodically refresh role check
      if (Date.now() - (session.lastRoleCheck || 0) > this.ROLE_REFRESH_INTERVAL) {
        return await this.verifyAdminRole();
      }

      return session.authenticated === true;
    } catch (error) {
      console.error('Error checking admin status:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Verify admin role with the server
   */
  private static async verifyAdminRole(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_any_role', { 
        roles: ['admin', 'super_admin'] 
      });

      if (error) throw error;
      
      // Update last role check time
      this.updateSession({ lastRoleCheck: Date.now() });
      
      return data === true;
    } catch (error) {
      console.error('Error verifying admin role:', error);
      return false;
    }
  }

  /**
   * Get current session info
   */
  static getSessionInfo(): { 
    authenticated: boolean; 
    timeRemaining?: number;
    userId?: string;
  } {
    try {
      const session = this.getSession();
      if (!session) return { authenticated: false };
      
      const timeRemaining = Math.max(0, session.expires - Date.now());
      
      return {
        authenticated: session.authenticated === true && timeRemaining > 0,
        timeRemaining,
        userId: session.userId
      };
    } catch (error) {
      return { authenticated: false };
    }
  }

  /**
   * Logout admin and clear session
   */
  static logout(): void {
    this.clearSession();
    // Redirect to home or login page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  /**
   * Extend session
   */
  static extendSession(): boolean {
    try {
      const session = this.getSession();
      if (!session) return false;

      this.updateSession({
        expires: Date.now() + this.SESSION_DURATION
      });
      
      return true;
    } catch (error) {
      console.error('Error extending session:', error);
      return false;
    }
  }

  /**
   * Initialize session from Supabase auth
   */
  static async initializeFromSupabase(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        this.clearSession();
        return false;
      }

      // Verify user has admin role
      const isAdmin = await this.verifyAdminRole();
      if (!isAdmin) {
        this.clearSession();
        return false;
      }

      // Create new session
      this.updateSession({
        authenticated: true,
        userId: user.id,
        email: user.email,
        expires: Date.now() + this.SESSION_DURATION,
        lastRoleCheck: Date.now()
      });

      return true;
    } catch (error) {
      console.error('Error initializing admin session:', error);
      this.clearSession();
      return false;
    }
  }

  /**
   * Get current session
   */
  private static getSession(): any | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const sessionData = sessionStorage.getItem(this.ADMIN_SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }

  /**
   * Update session data
   */
  private static updateSession(updates: Record<string, any>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const currentSession = this.getSession() || {};
      const newSession = { ...currentSession, ...updates };
      sessionStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(newSession));
    } catch (error) {
      console.error('Error updating session:', error);
    }
  }

  /**
   * Clear session data
   */
  private static clearSession(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(this.ADMIN_SESSION_KEY);
  }

  /**
   * Handle authentication state changes
   */
  static async handleAuthStateChange(event: string) {
    if (event === 'SIGNED_OUT') {
      this.clearSession();
    } else if (event === 'SIGNED_IN') {
      await this.initializeFromSupabase();
    }
  }
}
