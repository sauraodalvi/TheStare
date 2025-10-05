/**
 * Admin Profile Service
 * Handles user profile management for admin dashboard
 */

import { supabase } from '@/integrations/supabase/client';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  UserProfile,
  AdminUserSummary,
  UpdateUserProfile,
  UserSearchParams,
  UserAnalytics,
  SubscriptionType,
  CareerStatus
} from '@/types/profile';

export class AdminProfileService {
  /**
   * Get paginated list of users with profiles for admin dashboard
   */
  static async getUsers(params: UserSearchParams = {}): Promise<{
    data: AdminUserSummary[];
    totalCount: number;
    hasMore: boolean;
  }> {
    const {
      query = '',
      filters = {},
      sort_by = 'created_at',
      sort_order = 'desc',
      page = 1,
      limit = 50
    } = params;

    try {
      let queryBuilder = supabaseAdmin
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          subscription_type,
          subscription_end_date,
          career_status,
          uploaded_case_study_count,
          profile_completion_percentage,
          created_at,
          last_login_at,
          is_featured,
          is_blocked
        `, { count: 'exact' });

      // Apply text search
      if (query.trim()) {
        queryBuilder = queryBuilder.or(`
          email.ilike.%${query}%,
          full_name.ilike.%${query}%,
          current_company.ilike.%${query}%,
          current_role.ilike.%${query}%
        `);
      }

      // Apply filters
      // IMPORTANT: Do not filter by subscription_type at the DB level because
      // the column may be either TEXT or SMALLINT depending on environment.
      // We'll filter in JS after fetching.

      if (filters.career_status?.length) {
        queryBuilder = queryBuilder.in('career_status', filters.career_status);
      }

      if (filters.is_featured !== undefined) {
        queryBuilder = queryBuilder.eq('is_featured', filters.is_featured);
      }

      if (filters.is_blocked !== undefined) {
        queryBuilder = queryBuilder.eq('is_blocked', filters.is_blocked);
      }

      if (filters.created_after) {
        queryBuilder = queryBuilder.gte('created_at', filters.created_after);
      }

      if (filters.created_before) {
        queryBuilder = queryBuilder.lte('created_at', filters.created_before);
      }

      if (filters.last_login_after) {
        queryBuilder = queryBuilder.gte('last_login_at', filters.last_login_after);
      }

      if (filters.last_login_before) {
        queryBuilder = queryBuilder.lte('last_login_at', filters.last_login_before);
      }

      if (filters.min_case_studies !== undefined) {
        queryBuilder = queryBuilder.gte('uploaded_case_study_count', filters.min_case_studies);
      }

      if (filters.min_profile_completion !== undefined) {
        queryBuilder = queryBuilder.gte('profile_completion_percentage', filters.min_profile_completion);
      }

      // Apply sorting
      queryBuilder = queryBuilder.order(sort_by, { ascending: sort_order === 'asc' });

      // Apply pagination
      const offset = (page - 1) * limit;
      queryBuilder = queryBuilder.range(offset, offset + limit - 1);

      const { data, error, count } = await queryBuilder;

      if (error) {
        console.error('Error fetching users:', error);
        throw new Error(`Failed to fetch users: ${error.message}`);
      }

      // Normalize subscription_type supporting number or string values
      const normalized = (data || []).map((u: any) => {
        const st = u.subscription_type;
        const isPaid = typeof st === 'number'
          ? st === 1
          : (typeof st === 'string' && st.toLowerCase().trim() === 'paid');
        return {
          ...u,
          subscription_type: isPaid ? 'paid' : 'free',
        } as AdminUserSummary;
      });

      // Apply client-side filter for subscription_type if requested
      const filtered = filters.subscription_type?.length
        ? normalized.filter(u => filters.subscription_type!.includes(u.subscription_type as SubscriptionType))
        : normalized;

      const totalCount = filters.subscription_type?.length ? filtered.length : (count || 0);
      const hasMore = (offset + filtered.length) < totalCount;

      return {
        data: filtered,
        totalCount,
        hasMore
      };
    } catch (error) {
      console.error('AdminProfileService.getUsers error:', error);
      throw error;
    }
  }

  /**
   * Get detailed user profile by ID
   */
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        throw new Error(`Failed to fetch user profile: ${error.message}`);
      }

      // Normalize subscription_type for profile modal (support number or string)
      const stVal = (data as any)?.subscription_type;
      const isPaid = typeof stVal === 'number'
        ? stVal === 1
        : (typeof stVal === 'string' && stVal.toLowerCase().trim() === 'paid');

      return {
        ...(data as any),
        subscription_type: isPaid ? 'paid' : 'free',
      } as UserProfile;
    } catch (error) {
      console.error('AdminProfileService.getUserProfile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile (admin only)
   */
  static async updateUserProfile(userId: string, updates: UpdateUserProfile, adminId: string): Promise<UserProfile> {
    try {
      // Add admin tracking for subscription changes
      const updateData: Record<string, any> = {
        ...updates,
        updated_at: new Date().toISOString()
      };

      // If subscription is being updated, track who made the change
      if (updates.subscription_type || updates.subscription_end_date) {
        updateData.subscription_updated_at = new Date().toISOString();
        updateData.subscription_updated_by = adminId;
      }

      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(updateData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to update user profile: ${error.message}`);
      }

      // Normalize subscription_type for the return value
      const stVal = (data as any)?.subscription_type;
      const isPaid = typeof stVal === 'number'
        ? stVal === 1
        : (typeof stVal === 'string' && stVal.toLowerCase().trim() === 'paid');

      return {
        ...(data as any),
        subscription_type: isPaid ? 'paid' : 'free',
      } as UserProfile;
    } catch (error) {
      console.error('AdminProfileService.updateUserProfile error:', error);
      throw error;
    }
  }

  /**
   * Upgrade user to paid subscription
   */
  static async upgradeUserToPaid(userId: string, endDate: string, adminId: string): Promise<UserProfile> {
    return this.updateUserProfile(userId, {
      subscription_type: 'paid',
      subscription_start_date: new Date().toISOString(),
      subscription_end_date: endDate,
    }, adminId);
  }

  /**
   * Downgrade user to free subscription
   */
  static async downgradeUserToFree(userId: string, adminId: string): Promise<UserProfile> {
    return this.updateUserProfile(userId, {
      subscription_type: 'free',
      subscription_start_date: null,
      subscription_end_date: null,
    }, adminId);
  }

  /**
   * Toggle user featured status
   */
  static async toggleUserFeatured(userId: string, adminId: string): Promise<UserProfile> {
    try {
      // First get current status
      const currentProfile = await this.getUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User not found');
      }

      return this.updateUserProfile(userId, {
        is_featured: !currentProfile.is_featured
      }, adminId);
    } catch (error) {
      console.error('AdminProfileService.toggleUserFeatured error:', error);
      throw error;
    }
  }

  /**
   * Toggle user blocked status
   */
  static async toggleUserBlocked(userId: string, adminId: string): Promise<UserProfile> {
    try {
      // First get current status
      const currentProfile = await this.getUserProfile(userId);
      if (!currentProfile) {
        throw new Error('User not found');
      }

      return this.updateUserProfile(userId, {
        is_blocked: !currentProfile.is_blocked
      }, adminId);
    } catch (error) {
      console.error('AdminProfileService.toggleUserBlocked error:', error);
      throw error;
    }
  }

  /**
   * Get user analytics for admin dashboard
   */
  static async getUserAnalytics(): Promise<UserAnalytics> {
    try {
      // Get basic counts
      const { data: allUsers, error: allUsersError } = await supabaseAdmin
        .from('profiles')
        .select('subscription_type, career_status, created_at, last_login_at, is_featured, is_blocked, uploaded_case_study_count, profile_completion_percentage');

      if (allUsersError) {
        throw new Error(`Failed to fetch user analytics: ${allUsersError.message}`);
      }

      const users = (allUsers || []) as any[];
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Calculate analytics
      const isPaid = (u: any) => {
        const t = u?.subscription_type;
        if (typeof t === 'number') return t === 1; // smallint cast to number
        if (typeof t === 'string') {
          const n = t.toLowerCase().trim();
          return n === 'paid' || n === '1';
        }
        return false;
      };

      const analytics: UserAnalytics = {
        total_users: users.length,
        free_users: users.filter(u => !isPaid(u)).length,
        paid_users: users.filter(u => isPaid(u)).length,
        active_users_30d: users.filter(u => u.last_login_at && new Date(u.last_login_at) >= thirtyDaysAgo).length,
        new_users_30d: users.filter(u => new Date(u.created_at) >= thirtyDaysAgo).length,
        featured_users: users.filter(u => u.is_featured).length,
        blocked_users: users.filter(u => u.is_blocked).length,
        avg_profile_completion: users.length > 0 
          ? Math.round(users.reduce((sum, u) => sum + (u.profile_completion_percentage || 0), 0) / users.length)
          : 0,
        total_case_studies_uploaded: users.reduce((sum, u) => sum + (u.uploaded_case_study_count || 0), 0),
        career_status_breakdown: {
          job_seeker: users.filter(u => u.career_status === 'job_seeker').length,
          hiring: users.filter(u => u.career_status === 'hiring').length,
          employed: users.filter(u => u.career_status === 'employed').length,
          not_specified: users.filter(u => u.career_status === 'not_specified').length,
        },
        subscription_expiring_soon: 0 // Will be calculated separately
      };

      // Calculate subscriptions expiring in next 30 days
      const { data: expiringUsers, error: expiringError } = await supabaseAdmin
        .from('profiles')
        .select('subscription_end_date, subscription_type')
        .not('subscription_end_date', 'is', null)
        .lte('subscription_end_date', new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString())
        .gte('subscription_end_date', now.toISOString());

      if (!expiringError) {
        const expUsers = (expiringUsers || []) as any[];
        analytics.subscription_expiring_soon = expUsers.filter(u => isPaid(u)).length;
      }

      return analytics;
    } catch (error) {
      console.error('AdminProfileService.getUserAnalytics error:', error);
      throw error;
    }
  }

  /**
   * Delete user profile (admin only - use with caution)
   */
  static async deleteUserProfile(userId: string): Promise<void> {
    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error(`Failed to delete user profile: ${error.message}`);
      }
    } catch (error) {
      console.error('AdminProfileService.deleteUserProfile error:', error);
      throw error;
    }
  }
}
