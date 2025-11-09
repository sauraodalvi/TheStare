-- Create a secure public view for profiles
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  id,
  username,
  full_name,
  avatar_url,
  headline,
  location,
  website,
  linkedin_url,
  twitter_handle,
  bio,
  profile_visibility,
  created_at,
  updated_at
FROM auth.users
WHERE profile_visibility = 'public' AND is_blocked = false;

-- Revoke direct access to auth.users from public
REVOKE ALL ON auth.users FROM public;
REVOKE ALL ON profiles FROM public;

-- Grant select on the secure view
GRANT SELECT ON public.user_profiles TO public;

-- Update RLS policies on profiles table
DROP POLICY IF EXISTS "Public can view public profiles" ON profiles;
CREATE POLICY "Public can view limited profile data"
  ON profiles FOR SELECT
  USING (profile_visibility = 'public' AND is_blocked = false);

-- Add RLS to storage buckets
CREATE POLICY "Public read access for company logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'company-logos');

CREATE POLICY "Authenticated read access for case studies"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'case-study-pdfs' AND auth.role() = 'authenticated');

-- Create user roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  USING (EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  ));

-- Update all functions to include search_path
DO $$
DECLARE
  func_record RECORD;
BEGIN
  FOR func_record IN 
    SELECT proname, nspname 
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND proname IN (
      'handle_new_user',
      'update_updated_at_column',
      'update_profile_completion',
      'handle_updated_at',
      'calculate_profile_completion'
    )
  LOOP
    EXECUTE format('ALTER FUNCTION %I.%s SET search_path = %L', 
                  func_record.nspname, 
                  func_record.proname, 
                  'public, auth, storage, extensions');
  END LOOP;
END $$;
