-- Create user_roles table for role-based access control
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL CHECK (role_name IN ('super_admin', 'admin', 'moderator', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE,
  CONSTRAINT unique_user_role UNIQUE(user_id, role_name)
);

-- Create an index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_name ON public.user_roles(role_name);

-- Create a function to check if a user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(
  user_id UUID,
  role_name TEXT
) 
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_roles.user_id = has_role.user_id 
      AND user_roles.role_name = has_role.role_name
      AND (user_roles.expires_at IS NULL OR user_roles.expires_at > NOW())
      AND user_roles.is_active = TRUE
  );
$$;

-- Create a secure view for public profile data (without sensitive information)
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  portfolio_url,
  linkedin_url,
  bio,
  current_role,
  current_company,
  years_of_experience,
  skills,
  career_status,
  job_preferences,
  uploaded_case_study_count,
  profile_completion_percentage,
  is_featured,
  created_at,
  updated_at
FROM public.profiles
WHERE profile_visibility = 'public' AND is_blocked = false;

-- Update RLS policies for profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view public profiles" ON public.profiles;

-- New policies for profiles table
-- Only allow users to see their own profile or public profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Public can view public profiles (limited fields)"
  ON public.profiles
  FOR SELECT
  USING (profile_visibility = 'public' AND is_blocked = false);

-- Only allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admin policy (will be checked via function)
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create a function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin');
$$;

-- Set search_path on all existing functions
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.calculate_profile_completion(UUID) SET search_path = public;
ALTER FUNCTION public.update_profile_completion() SET search_path = public;

-- Create admin role and grant necessary permissions
DO $$
BEGIN
  -- Create admin role if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated_admin') THEN
    CREATE ROLE authenticated_admin;
  END IF;
  
  -- Grant permissions
  GRANT USAGE ON SCHEMA public TO authenticated_admin;
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated_admin;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated_admin;
  GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated_admin;
  
  -- Create default admin user (replace with actual user ID)
  -- This should be replaced with your actual admin user ID
  -- INSERT INTO public.user_roles (user_id, role_name, created_by)
  -- VALUES ('00000000-0000-0000-0000-000000000000', 'super_admin', '00000000-0000-0000-0000-000000000000');
  
  -- Revoke default permissions
  REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
  
  -- Grant minimal required permissions
  GRANT SELECT ON public.public_profiles TO anon, authenticated;
  GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
  
  -- Set default permissions for future tables
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated_admin;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO authenticated_admin;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO authenticated_admin;
END
$$;

-- Create a function to get the current user's role(s)
CREATE OR REPLACE FUNCTION public.get_user_roles()
RETURNS TABLE(role_name TEXT)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT ur.role_name
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid()
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    AND ur.is_active = TRUE;
$$;

-- Create a function to check if a user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = auth.uid()
      AND role_name = ANY(roles)
      AND (expires_at IS NULL OR expires_at > NOW())
      AND is_active = TRUE
  );
$$;
