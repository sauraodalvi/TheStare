import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

class AdminDataService {
  /**
   * Fetch users from the database
   */
  static async getUsers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      return [];
    }
  }

  /**
   * Fetch analytics data
   */
  static async getAnalytics() {
    try {
      // Get user count
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get active sessions (this is a placeholder - you might need to implement actual session tracking)
      const activeSessions = 0; // Replace with actual session count

      // Get new signups in last 24 hours
      const { count: newSignups } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      return {
        userCount: userCount || 0,
        activeSessions,
        newSignups: newSignups || 0,
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
      return {
        userCount: 0,
        activeSessions: 0,
        newSignups: 0,
      };
    }
  }
}

export default AdminDataService;
