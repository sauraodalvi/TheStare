-- Enable Row Level Security on all tables
DO $$
DECLARE
    t record;
BEGIN
    FOR t IN 
        SELECT table_schema, table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE 'pg_%' 
        AND table_name NOT LIKE 'sql_%'
        AND table_name != 'spatial_ref_sys'
    LOOP
        EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;', 
                      t.table_schema, t.table_name);
        RAISE NOTICE 'Enabled RLS on %.%', t.table_schema, t.table_name;
    END LOOP;
END $$;

-- Create admin role if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin') THEN
        CREATE ROLE admin;
        GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
        GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;
        GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO admin;
        RAISE NOTICE 'Created admin role';
    END IF;
END $$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM auth.users 
        WHERE id = auth.uid() 
        AND raw_user_meta_data->>'is_admin' = 'true'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is authenticated
CREATE OR REPLACE FUNCTION is_authenticated()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user owns a record
CREATE OR REPLACE FUNCTION is_owner(table_name TEXT, owner_id_col TEXT, user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    query TEXT;
    result BOOLEAN;
BEGIN
    query := format('SELECT EXISTS (SELECT 1 FROM %I WHERE %I = $1 AND %I = $2)', 
                   table_name, owner_id_col, 'user_id');
    EXECUTE query USING user_id, auth.uid() INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up profiles table policies
CREATE OR REPLACE FUNCTION setup_profile_policies()
RETURNS void AS $$
BEGIN
    -- Allow public to view all profiles
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Allow public read access'
    ) THEN
        CREATE POLICY "Allow public read access" 
        ON public.profiles 
        FOR SELECT 
        USING (true);
    END IF;
    
    -- Allow users to update their own profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Users can update own profile'
    ) THEN
        CREATE POLICY "Users can update own profile" 
        ON public.profiles 
        FOR UPDATE 
        USING (auth.uid() = id)
        WITH CHECK (auth.uid() = id);
    END IF;
    
    -- Allow admins to update any profile
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND policyname = 'Admins can update any profile'
    ) THEN
        CREATE POLICY "Admins can update any profile" 
        ON public.profiles 
        FOR ALL 
        USING (is_admin())
        WITH CHECK (is_admin());
    END IF;
    
    RAISE NOTICE 'Profile policies set up';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up case_studies table policies
CREATE OR REPLACE FUNCTION setup_case_study_policies()
RETURNS void AS $$
BEGIN
    -- Allow public to view published case studies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'case_studies' 
        AND policyname = 'Allow public read access to published case studies'
    ) THEN
        CREATE POLICY "Allow public read access to published case studies" 
        ON public.case_studies 
        FOR SELECT 
        USING (status = 'published');
    END IF;
    
    -- Allow authenticated users to view their own case studies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'case_studies' 
        AND policyname = 'Allow users to view their own case studies'
    ) THEN
        CREATE POLICY "Allow users to view their own case studies" 
        ON public.case_studies 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
    
    -- Allow users to create case studies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'case_studies' 
        AND policyname = 'Allow users to create case studies'
    ) THEN
        CREATE POLICY "Allow users to create case studies" 
        ON public.case_studies 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Allow users to update their own case studies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'case_studies' 
        AND policyname = 'Allow users to update their own case studies'
    ) THEN
        CREATE POLICY "Allow users to update their own case studies" 
        ON public.case_studies 
        FOR UPDATE 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Allow admins full access to all case studies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'case_studies' 
        AND policyname = 'Allow admins full access to all case studies'
    ) THEN
        CREATE POLICY "Allow admins full access to all case studies" 
        ON public.case_studies 
        FOR ALL 
        USING (is_admin())
        WITH CHECK (is_admin());
    END IF;
    
    RAISE NOTICE 'Case study policies set up';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Set up subscriptions table policies
CREATE OR REPLACE FUNCTION setup_subscription_policies()
RETURNS void AS $$
BEGIN
    -- Allow users to view their own subscriptions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscriptions' 
        AND policyname = 'Allow users to view their own subscriptions'
    ) THEN
        CREATE POLICY "Allow users to view their own subscriptions" 
        ON public.subscriptions 
        FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;
    
    -- Allow users to create their own subscriptions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscriptions' 
        AND policyname = 'Allow users to create their own subscriptions'
    ) THEN
        CREATE POLICY "Allow users to create their own subscriptions" 
        ON public.subscriptions 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Allow users to update their own subscriptions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscriptions' 
        AND policyname = 'Allow users to update their own subscriptions'
    ) THEN
        CREATE POLICY "Allow users to update their own subscriptions" 
        ON public.subscriptions 
        FOR UPDATE 
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Allow admins full access to all subscriptions
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'subscriptions' 
        AND policyname = 'Allow admins full access to all subscriptions'
    ) THEN
        CREATE POLICY "Allow admins full access to all subscriptions" 
        ON public.subscriptions 
        FOR ALL 
        USING (is_admin())
        WITH CHECK (is_admin());
    END IF;
    
    RAISE NOTICE 'Subscription policies set up';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to run all setup functions
CREATE OR REPLACE FUNCTION setup_database()
RETURNS void AS $$
BEGIN
    PERFORM setup_profile_policies();
    PERFORM setup_case_study_policies();
    PERFORM setup_subscription_policies();
    RAISE NOTICE '✅ Database setup completed successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the setup
SELECT setup_database();
