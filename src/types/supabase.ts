export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'moderator' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'moderator' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'moderator' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          headline: string | null
          location: string | null
          website: string | null
          linkedin_url: string | null
          twitter_handle: string | null
          bio: string | null
          profile_visibility: 'public' | 'private'
          is_blocked: boolean
          created_at: string
          updated_at: string
        }
      }
    }
    Views: {
      user_profiles: {
        Row: Pick<
          Database['public']['Tables']['profiles']['Row'],
          'id' | 'username' | 'full_name' | 'avatar_url' | 'headline' | 
          'location' | 'website' | 'linkedin_url' | 'twitter_handle' | 
          'bio' | 'profile_visibility' | 'created_at' | 'updated_at'
        >
      }
    }
    Functions: {
      handle_new_user: {
        Args: { user_id: string }
        Returns: undefined
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_profile_completion: {
        Args: { user_id: string }
        Returns: number
      }
      handle_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_profile_completion: {
        Args: { user_id: string }
        Returns: number
      }
    }
  }
}
