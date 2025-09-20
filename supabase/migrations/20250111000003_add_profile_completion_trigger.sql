-- Add trigger to update profile completion percentage
CREATE OR REPLACE TRIGGER update_profile_completion_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_profile_completion();

-- Update existing profiles to have their completion percentage calculated
UPDATE public.profiles 
SET profile_completion_percentage = public.calculate_profile_completion(id)
WHERE profile_completion_percentage = 0 OR profile_completion_percentage IS NULL;
