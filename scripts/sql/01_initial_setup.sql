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
