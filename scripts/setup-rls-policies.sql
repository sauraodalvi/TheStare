-- Enable RLS on all tables that contain sensitive data
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- Public profiles view (non-sensitive data only)
CREATE OR REPLACE VIEW public.public_profiles AS
  SELECT 
    id,
    username,
    full_name,
    avatar_url,
    created_at,
    updated_at
  FROM profiles
  WHERE is_public = true;

-- Profile policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Admin policies
CREATE POLICY "Admins can manage all profiles"
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email LIKE '%@getstare.com'
  ));

-- Subscription policies
CREATE POLICY "Users can view their own subscriptions"
  ON public.subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions"
  ON public.subscriptions
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = auth.uid() 
    AND auth.users.email LIKE '%@getstare.com'
  ));

-- Case study policies
CREATE POLICY "Users can view their own case studies"
  ON public.case_studies
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create case studies"
  ON public.case_studies
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case studies"
  ON public.case_studies
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Public case studies are viewable by everyone"
  ON public.case_studies
  FOR SELECT
  USING (is_public = true);

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() 
    AND email LIKE '%@getstare.com'
  );
$$ LANGUAGE sql SECURITY DEFINER;
