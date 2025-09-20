/**
 * Admin Authentication Service
 * Handles environment variable-based admin authentication with sessionStorage
 */

export class AdminAuthService {
  private static readonly ADMIN_SESSION_KEY = 'admin_session';
  private static readonly ADMIN_PASSWORD_KEY = 'VITE_ADMIN_PASSWORD';

  /**
   * Check if admin password is configured
   */
  static isConfigured(): boolean {
    const adminPassword = import.meta.env[this.ADMIN_PASSWORD_KEY];
    return !!adminPassword && adminPassword.trim().length > 0;
  }

  /**
   * Authenticate admin with password
   */
  static authenticate(password: string): boolean {
    const adminPassword = import.meta.env[this.ADMIN_PASSWORD_KEY];

    // Debug logging
    console.log('🔐 Admin Authentication Debug:');
    console.log('- Environment Key:', this.ADMIN_PASSWORD_KEY);
    console.log('- Configured Password:', adminPassword ? '[CONFIGURED]' : '[NOT CONFIGURED]');
    console.log('- Input Password Length:', password.length);
    console.log('- Passwords Match:', password === adminPassword);

    if (!adminPassword) {
      console.warn('Admin password not configured in environment variables');
      return false;
    }

    if (password === adminPassword) {
      // Store session in sessionStorage (expires on browser close)
      const session = {
        authenticated: true,
        timestamp: Date.now(),
        expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      };
      
      sessionStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
      console.log('Admin authenticated successfully');
      return true;
    }

    console.warn('Invalid admin password attempt');
    return false;
  }

  /**
   * Check if current session is valid
   */
  static isAuthenticated(): boolean {
    try {
      const sessionData = sessionStorage.getItem(this.ADMIN_SESSION_KEY);
      
      if (!sessionData) {
        return false;
      }

      const session = JSON.parse(sessionData);
      
      // Check if session is expired
      if (Date.now() > session.expires) {
        this.logout();
        return false;
      }

      return session.authenticated === true;
    } catch (error) {
      console.error('Error checking admin authentication:', error);
      this.logout();
      return false;
    }
  }

  /**
   * Logout admin and clear session
   */
  static logout(): void {
    sessionStorage.removeItem(this.ADMIN_SESSION_KEY);
    console.log('Admin logged out');
  }

  /**
   * Get session info
   */
  static getSessionInfo(): { authenticated: boolean; timeRemaining?: number } {
    try {
      const sessionData = sessionStorage.getItem(this.ADMIN_SESSION_KEY);
      
      if (!sessionData) {
        return { authenticated: false };
      }

      const session = JSON.parse(sessionData);
      const timeRemaining = Math.max(0, session.expires - Date.now());
      
      return {
        authenticated: this.isAuthenticated(),
        timeRemaining
      };
    } catch (error) {
      return { authenticated: false };
    }
  }

  /**
   * Extend session by 8 hours
   */
  static extendSession(): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    try {
      const session = {
        authenticated: true,
        timestamp: Date.now(),
        expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      };
      
      sessionStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
      return true;
    } catch (error) {
      console.error('Error extending admin session:', error);
      return false;
    }
  }
}
