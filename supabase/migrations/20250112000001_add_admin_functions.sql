-- Function to check if current user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
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

-- Function to get current user's roles
CREATE OR REPLACE FUNCTION public.get_current_user_roles()
RETURNS TABLE(role_name TEXT)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ur.role_name
  FROM public.user_roles ur
  WHERE ur.user_id = auth.uid()
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    AND ur.is_active = TRUE;
$$;

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_any_role(ARRAY['admin', 'super_admin']);
$$;

-- Function to check if current user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_any_role(ARRAY['super_admin']);
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION public.has_any_role(TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_roles() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin() TO authenticated;

-- Create admin role if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated_admin') THEN
    CREATE ROLE authenticated_admin;
  END IF;
  
  -- Grant necessary permissions
  GRANT authenticated_admin TO authenticated;
  
  -- Grant permissions to the admin role
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated_admin;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO authenticated_admin;
  GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated_admin;
  
  -- Set default permissions for future objects
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated_admin;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated_admin;
  ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated_admin;
  
  -- Grant usage on schema
  GRANT USAGE ON SCHEMA public TO authenticated_admin;
END
$$;
