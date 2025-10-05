/**
 * User Profile Types for Admin Dashboard
 * Corresponds to the profiles table in Supabase
 */

export type SubscriptionType = 'free' | 'paid';

export type CareerStatus = 'job_seeker' | 'hiring' | 'employed' | 'not_specified';

export type ProfileVisibility = 'public' | 'private' | 'members_only';

export interface JobPreferences {
  location?: string[];
  remote?: boolean;
  salary_range?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  job_types?: string[];
  industries?: string[];
  company_sizes?: string[];
}

export interface UserProfile {
  // Primary key and foreign key to auth.users
  id: string;
  
  // Basic profile information
  email?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  
  // Subscription management fields
  subscription_type: SubscriptionType;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
  subscription_updated_at?: string | null;
  subscription_updated_by?: string | null;
  
  // Gumroad integration fields
  license_key?: string | null;
  gumroad_subscription_id?: string | null;
  gumroad_sale_id?: string | null;
  product_id?: string | null;
  subscription_status?: string | null;
  
  // Professional profile information
  portfolio_url?: string | null;
  linkedin_url?: string | null;
  resume_url?: string | null;
  bio?: string | null;
  current_title?: string | null;
  current_company?: string | null;
  years_of_experience?: number | null;
  skills?: string[] | null;
  
  // Career tracking
  career_status: CareerStatus;
  job_preferences?: JobPreferences | null;
  
  // Activity tracking
  uploaded_case_study_count: number;
  last_case_study_upload?: string | null;
  profile_completion_percentage: number;
  
  // Audit fields
  created_at: string;
  updated_at: string;
  last_login_at?: string | null;
  
  // Admin notes and flags
  admin_notes?: string | null;
  is_featured: boolean;
  is_blocked: boolean;
  
  // Preferences
  email_notifications: boolean;
  profile_visibility: ProfileVisibility;
}

// For creating new profiles
export interface CreateUserProfile {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  subscription_type?: SubscriptionType;
  career_status?: CareerStatus;
  profile_visibility?: ProfileVisibility;
  email_notifications?: boolean;
}

// For updating profiles (admin)
export interface UpdateUserProfile {
  full_name?: string;
  avatar_url?: string;
  subscription_type?: SubscriptionType;
  subscription_start_date?: string | null;
  subscription_end_date?: string | null;
  subscription_updated_by?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  resume_url?: string;
  bio?: string;
  current_title?: string;
  current_company?: string;
  years_of_experience?: number;
  skills?: string[];
  career_status?: CareerStatus;
  job_preferences?: JobPreferences;
  admin_notes?: string;
  is_featured?: boolean;
  is_blocked?: boolean;
  email_notifications?: boolean;
  profile_visibility?: ProfileVisibility;
}

// For user self-updates (restricted fields)
export interface UpdateOwnProfile {
  full_name?: string;
  avatar_url?: string;
  portfolio_url?: string;
  linkedin_url?: string;
  resume_url?: string;
  bio?: string;
  current_title?: string;
  current_company?: string;
  years_of_experience?: number;
  skills?: string[];
  career_status?: CareerStatus;
  job_preferences?: JobPreferences;
  email_notifications?: boolean;
  profile_visibility?: ProfileVisibility;
}

// Admin dashboard specific types
export interface AdminUserSummary {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string | null;
  subscription_type: SubscriptionType;
  subscription_end_date?: string | null;
  career_status: CareerStatus;
  uploaded_case_study_count: number;
  profile_completion_percentage: number;
  created_at: string;
  last_login_at?: string | null;
  is_featured: boolean;
  is_blocked: boolean;
}

// Filter and search types for admin dashboard
export interface UserFilters {
  subscription_type?: SubscriptionType[];
  career_status?: CareerStatus[];
  is_featured?: boolean;
  is_blocked?: boolean;
  created_after?: string;
  created_before?: string;
  last_login_after?: string;
  last_login_before?: string;
  min_case_studies?: number;
  min_profile_completion?: number;
}

export interface UserSearchParams {
  query?: string;
  filters?: UserFilters;
  sort_by?: 'created_at' | 'last_login_at' | 'subscription_end_date' | 'profile_completion_percentage' | 'uploaded_case_study_count';
  sort_order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Analytics types
export interface UserAnalytics {
  total_users: number;
  free_users: number;
  paid_users: number;
  active_users_30d: number;
  new_users_30d: number;
  featured_users: number;
  blocked_users: number;
  avg_profile_completion: number;
  total_case_studies_uploaded: number;
  career_status_breakdown: Record<CareerStatus, number>;
  subscription_expiring_soon: number;
}
