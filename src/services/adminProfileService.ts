/**
 * Admin Profile Service
 * Handles user profile management for admin dashboard via secure edge function
 */

import { supabase } from '@/lib/supabase';
import {
  UserProfile,
  AdminUserSummary,
  UpdateUserProfile,
  UserSearchParams,
  UserAnalytics,
  SubscriptionType,
  CareerStatus
} from '@/types/profile';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class AdminAPIError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'AdminAPIError';
  }
}

async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL}/functions/v1/admin-operations/${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ANON_KEY}`,
      'X-Admin-Password': ADMIN_PASSWORD,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new AdminAPIError(errorData.message || 'Admin API request failed', response.status);
  }

  return response.json();
}

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
      const searchParams = new URLSearchParams({
        query,
        sort_by,
        sort_order,
        page: page.toString(),
        limit: limit.toString(),
      });

      const result = await adminFetch(`users?${searchParams}`);
      return result;
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
      const data = await adminFetch(`users?userId=${userId}`);
      return data as UserProfile;
    } catch (error) {
      if (error instanceof AdminAPIError && error.status === 404) {
        return null;
      }
      console.error('AdminProfileService.getUserProfile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile (admin only)
   */
  static async updateUserProfile(userId: string, updates: UpdateUserProfile, adminId: string): Promise<UserProfile> {
    try {
      const data = await adminFetch('users', {
        method: 'PUT',
        body: JSON.stringify({ userId, updates }),
      });
      return data as UserProfile;
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
      const data = await adminFetch('analytics');
      return data as UserAnalytics;
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
      await adminFetch('users', {
        method: 'DELETE',
        body: JSON.stringify({ userId }),
      });
    } catch (error) {
      console.error('AdminProfileService.deleteUserProfile error:', error);
      throw error;
    }
  }
}
