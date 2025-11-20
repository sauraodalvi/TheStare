-- Enable RLS on the questions table
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON questions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON questions;

-- Policy: Allow public read access
CREATE POLICY "Enable read access for all users" ON questions
    FOR SELECT
    USING (true);

-- Policy: Allow authenticated users to update answers
-- This allows any authenticated user to update any question.
-- This is required for the shared answer model.
CREATE POLICY "Enable update for authenticated users" ON questions
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Allow authenticated users to insert new questions
CREATE POLICY "Enable insert for authenticated users" ON questions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
