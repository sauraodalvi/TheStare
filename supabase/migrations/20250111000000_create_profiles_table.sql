-- Create profiles table for user subscription and profile management
-- This extends Supabase's built-in auth.users table with additional profile information

CREATE TABLE IF NOT EXISTS public.profiles (
  -- Primary key and foreign key to auth.users
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  
  -- Basic profile information
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  
  -- Subscription management fields
  subscription_type TEXT CHECK (subscription_type IN ('free', 'paid')) DEFAULT 'free' NOT NULL,
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  subscription_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscription_updated_by TEXT,
  
  -- Professional profile information
  portfolio_url TEXT,
  linkedin_url TEXT,
  resume_url TEXT,
  bio TEXT,
  current_role TEXT,
  current_company TEXT,
  years_of_experience INTEGER,
  skills TEXT[], -- Array of skills
  
  -- Career tracking
  career_status TEXT CHECK (career_status IN ('job_seeker', 'hiring', 'employed', 'not_specified')) DEFAULT 'not_specified',
  job_preferences JSONB, -- Store job preferences as JSON
  
  -- Activity tracking
  uploaded_case_study_count INTEGER DEFAULT 0,
  last_case_study_upload TIMESTAMP WITH TIME ZONE,
  profile_completion_percentage INTEGER DEFAULT 0,
  
  -- Audit fields
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  last_login_at TIMESTAMP WITH TIME ZONE,
  
  -- Admin notes and flags
  admin_notes TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_blocked BOOLEAN DEFAULT FALSE,
  
  -- Preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  profile_visibility TEXT CHECK (profile_visibility IN ('public', 'private', 'members_only')) DEFAULT 'public'
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_type ON public.profiles(subscription_type);
CREATE INDEX IF NOT EXISTS idx_profiles_career_status ON public.profiles(career_status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_end_date ON public.profiles(subscription_end_date);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON public.profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_is_blocked ON public.profiles(is_blocked);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for Row Level Security
-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile (except admin fields)
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND
  -- Prevent users from modifying admin-only fields
  subscription_type = OLD.subscription_type AND
  subscription_start_date = OLD.subscription_start_date AND
  subscription_end_date = OLD.subscription_end_date AND
  subscription_updated_by = OLD.subscription_updated_by AND
  uploaded_case_study_count = OLD.uploaded_case_study_count AND
  admin_notes = OLD.admin_notes AND
  is_featured = OLD.is_featured AND
  is_blocked = OLD.is_blocked
);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Public can view public profiles (for portfolio/showcase features)
CREATE POLICY "Public can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (profile_visibility = 'public' AND is_blocked = FALSE);

-- Function to automatically create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate profile completion percentage
CREATE OR REPLACE FUNCTION public.calculate_profile_completion(profile_id UUID)
RETURNS INTEGER AS $$
DECLARE
  completion_score INTEGER := 0;
  profile_record RECORD;
BEGIN
  SELECT * INTO profile_record FROM public.profiles WHERE id = profile_id;
  
  IF profile_record IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Basic information (40 points total)
  IF profile_record.full_name IS NOT NULL AND profile_record.full_name != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_record.bio IS NOT NULL AND profile_record.bio != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_record.current_role IS NOT NULL AND profile_record.current_role != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_record.current_company IS NOT NULL AND profile_record.current_company != '' THEN
    completion_score := completion_score + 10;
  END IF;
  
  -- Professional links (30 points total)
  IF profile_record.portfolio_url IS NOT NULL AND profile_record.portfolio_url != '' THEN
    completion_score := completion_score + 15;
  END IF;
  
  IF profile_record.linkedin_url IS NOT NULL AND profile_record.linkedin_url != '' THEN
    completion_score := completion_score + 15;
  END IF;
  
  -- Additional information (30 points total)
  IF profile_record.skills IS NOT NULL AND array_length(profile_record.skills, 1) > 0 THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_record.years_of_experience IS NOT NULL THEN
    completion_score := completion_score + 10;
  END IF;
  
  IF profile_record.career_status != 'not_specified' THEN
    completion_score := completion_score + 10;
  END IF;
  
  RETURN completion_score;
END;
$$ LANGUAGE plpgsql;

-- Function to update profile completion percentage
CREATE OR REPLACE FUNCTION public.update_profile_completion()
RETURNS TRIGGER AS $$
BEGIN
  NEW.profile_completion_percentage := public.calculate_profile_completion(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profile completion on changes
DROP TRIGGER IF EXISTS on_profile_completion_update ON public.profiles;
CREATE TRIGGER on_profile_completion_update
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_profile_completion();
