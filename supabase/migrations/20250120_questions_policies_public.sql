-- Enable RLS on the questions table
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to replace them with public ones
DROP POLICY IF EXISTS "Enable read access for all users" ON questions;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON questions;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON questions;
DROP POLICY IF EXISTS "Enable update for all users" ON questions;
DROP POLICY IF EXISTS "Enable insert for all users" ON questions;

-- Policy: Allow public read access
CREATE POLICY "Enable read access for all users" ON questions
    FOR SELECT
    USING (true);

-- Policy: Allow PUBLIC (anonymous + authenticated) to update answers
-- This allows anyone to save an answer to an existing question
CREATE POLICY "Enable update for all users" ON questions
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);

-- Policy: Allow PUBLIC (anonymous + authenticated) to insert new questions
-- This allows anyone to contribute a new question
CREATE POLICY "Enable insert for all users" ON questions
    FOR INSERT
    TO public
    WITH CHECK (true);
