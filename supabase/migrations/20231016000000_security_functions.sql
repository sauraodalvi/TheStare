-- Enable Row Level Security on a table
CREATE OR REPLACE FUNCTION public.enable_rls_on_table(table_name text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);
  EXECUTE format('DROP POLICY IF EXISTS "Enable read access for all users" ON %I;', table_name);
  EXECUTE format('CREATE POLICY "Enable read access for all users" ON %I FOR SELECT USING (true);', table_name);
  
  EXECUTE format('DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON %I;', table_name);
  EXECUTE format('CREATE POLICY "Enable insert for authenticated users only" ON %I FOR INSERT TO authenticated WITH CHECK (true);', table_name);
  
  EXECUTE format('DROP POLICY IF EXISTS "Enable update for users based on user_id" ON %I;', table_name);
  EXECUTE format('CREATE POLICY "Enable update for users based on user_id" ON %I FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);', table_name);
  
  EXECUTE format('DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON %I;', table_name);
  EXECUTE format('CREATE POLICY "Enable delete for users based on user_id" ON %I FOR DELETE TO authenticated USING (auth.uid() = user_id);', table_name);
END;
$$;

-- Set authentication configuration
CREATE OR REPLACE FUNCTION public.set_auth_config(key text, value text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO auth.config (key, value)
  VALUES (key, value)
  ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
END;
$$;

-- Update CORS configuration
CREATE OR REPLACE FUNCTION public.update_cors_config(
  allowed_origins text[],
  allowed_methods text[],
  allowed_headers text[],
  allow_credentials boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update CORS configuration in the storage bucket policies
  UPDATE storage.buckets
  SET 
    cors_origins = allowed_origins,
    cors_methods = allowed_methods,
    cors_headers = allowed_headers,
    cors_credentials = allow_credentials
  WHERE name = 'public';
  
  -- Also update the auth configuration
  PERFORM set_auth_config('cors_allowed_origins', array_to_string(allowed_origins, ','));
  PERFORM set_auth_config('cors_allowed_methods', array_to_string(allowed_methods, ','));
  PERFORM set_auth_config('cors_allowed_headers', array_to_string(allowed_headers, ','));
  PERFORM set_auth_config('cors_allow_credentials', allow_credentials::text);
END;
$$;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
  );
$$;
