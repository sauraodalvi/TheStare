-- Enable Row Level Security on all tables
CREATE OR REPLACE FUNCTION public.enable_rls_on_all_tables()
RETURNS void AS $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN ('spatial_ref_sys', 'geography_columns', 'geometry_columns')
    LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t.tablename);
    END LOOP;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create admin role if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_admin_role_if_not_exists()
RETURNS void AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
        GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin;
    END IF;
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Setup profile policies
CREATE OR REPLACE FUNCTION public.setup_profile_policies()
RETURNS void AS $$
BEGIN
    -- Users can view their own profile
    DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
    CREATE POLICY "Users can view own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);
    
    -- Users can update their own profile
    DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
    CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);
    
    -- Admins can manage all profiles
    DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
    CREATE POLICY "Admins can manage all profiles"
    ON public.profiles
    FOR ALL
    USING (is_admin_user());
    
    -- Public can view public profiles (limited fields)
    DROP POLICY IF EXISTS "Public can view public profiles" ON public.profiles;
    CREATE POLICY "Public can view public profiles"
    ON public.profiles
    FOR SELECT
    USING (is_public = true);
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Setup case study policies
CREATE OR REPLACE FUNCTION public.setup_case_study_policies()
RETURNS void AS $$
BEGIN
    -- Users can view their own case studies
    DROP POLICY IF EXISTS "Users can view own case studies" ON public.case_studies;
    CREATE POLICY "Users can view own case studies"
    ON public.case_studies
    FOR SELECT
    USING (auth.uid() = user_id);
    
    -- Users can create case studies
    DROP POLICY IF EXISTS "Users can create case studies" ON public.case_studies;
    CREATE POLICY "Users can create case studies"
    ON public.case_studies
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
    
    -- Users can update their own case studies
    DROP POLICY IF EXISTS "Users can update own case studies" ON public.case_studies;
    CREATE POLICY "Users can update own case studies"
    ON public.case_studies
    FOR UPDATE
    USING (auth.uid() = user_id);
    
    -- Public can view public case studies
    DROP POLICY IF EXISTS "Public can view public case studies" ON public.case_studies;
    CREATE POLICY "Public can view public case studies"
    ON public.case_studies
    FOR SELECT
    USING (is_public = true);
    
    -- Admins can manage all case studies
    DROP POLICY IF EXISTS "Admins can manage all case studies" ON public.case_studies;
    CREATE POLICY "Admins can manage all case studies"
    ON public.case_studies
    FOR ALL
    USING (is_admin_user());
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Setup subscription policies
CREATE OR REPLACE FUNCTION public.setup_subscription_policies()
RETURNS void AS $$
BEGIN
    -- Users can view their own subscriptions
    DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
    CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions
    FOR SELECT
    USING (auth.uid() = user_id);
    
    -- Admins can manage all subscriptions
    DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;
    CREATE POLICY "Admins can manage all subscriptions"
    ON public.subscriptions
    FOR ALL
    USING (is_admin_user());
    
    RETURN;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'is_admin' = 'true'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
