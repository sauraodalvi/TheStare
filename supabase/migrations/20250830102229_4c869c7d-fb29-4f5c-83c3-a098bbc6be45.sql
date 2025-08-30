-- Enable Row Level Security on case_studies table
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published case studies
CREATE POLICY "Public can view published case studies" 
ON public.case_studies 
FOR SELECT 
USING (publish = true);

-- Allow authenticated users to insert new case studies
CREATE POLICY "Authenticated users can submit case studies" 
ON public.case_studies 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

-- Prevent public updates and deletes (only allow via admin interface)
CREATE POLICY "Only admins can update case studies" 
ON public.case_studies 
FOR UPDATE 
USING (false);

CREATE POLICY "Only admins can delete case studies" 
ON public.case_studies 
FOR DELETE 
USING (false);