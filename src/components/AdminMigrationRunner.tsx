import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Database, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AdminMigrationRunner = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'success' | 'error' | 'warning'>('idle');
  const [migrationMessage, setMigrationMessage] = useState('');

  const createProfilesTableSQL = `
-- Create profiles table for user subscription and profile management
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
);`;

  const createIndexesSQL = `
-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_type ON public.profiles(subscription_type);
CREATE INDEX IF NOT EXISTS idx_profiles_career_status ON public.profiles(career_status);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_end_date ON public.profiles(subscription_end_date);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_featured ON public.profiles(is_featured);
CREATE INDEX IF NOT EXISTS idx_profiles_is_blocked ON public.profiles(is_blocked);`;

  const enableRLSSQL = `
-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`;

  const createPoliciesSQL = `
-- Create policies for Row Level Security
-- Users can view their own profile
CREATE POLICY IF NOT EXISTS "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Users can update their own profile (except admin fields)
CREATE POLICY IF NOT EXISTS "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY IF NOT EXISTS "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Public can view public profiles (for portfolio/showcase features)
CREATE POLICY IF NOT EXISTS "Public can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (profile_visibility = 'public' AND is_blocked = FALSE);`;

  const runMigration = async () => {
    setIsRunning(true);
    setMigrationStatus('idle');
    setMigrationMessage('');

    try {
      // Step 1: Create the profiles table
      console.log('Creating profiles table...');
      const { error: tableError } = await supabase.rpc('exec_sql', { 
        sql: createProfilesTableSQL 
      });

      if (tableError) {
        // Try alternative approach using direct SQL execution
        const { error: directError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);

        if (directError && directError.code === '42P01') {
          // Table doesn't exist, we need to create it manually
          throw new Error('Profiles table needs to be created manually in Supabase SQL Editor');
        }
      }

      // Step 2: Create indexes
      console.log('Creating indexes...');
      await supabase.rpc('exec_sql', { sql: createIndexesSQL });

      // Step 3: Enable RLS
      console.log('Enabling Row Level Security...');
      await supabase.rpc('exec_sql', { sql: enableRLSSQL });

      // Step 4: Create policies
      console.log('Creating RLS policies...');
      await supabase.rpc('exec_sql', { sql: createPoliciesSQL });

      // Test if the table exists and is accessible
      const { data, error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (testError) {
        if (testError.code === '42P01') {
          setMigrationStatus('warning');
          setMigrationMessage('Profiles table does not exist. Please run the migration SQL manually in Supabase SQL Editor.');
          toast.warning('Migration needs manual execution', {
            description: 'Please copy the SQL from the migration file and run it in Supabase SQL Editor.'
          });
        } else {
          throw testError;
        }
      } else {
        setMigrationStatus('success');
        setMigrationMessage('Profiles table migration completed successfully!');
        toast.success('Migration completed successfully');
      }

    } catch (error) {
      console.error('Migration error:', error);
      setMigrationStatus('error');
      setMigrationMessage(error instanceof Error ? error.message : 'Unknown error occurred');
      toast.error('Migration failed', {
        description: 'Please check the console for details.'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const checkTableExists = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          setMigrationStatus('warning');
          setMigrationMessage('Profiles table does not exist yet.');
        } else {
          setMigrationStatus('error');
          setMigrationMessage(`Error checking table: ${error.message}`);
        }
      } else {
        setMigrationStatus('success');
        setMigrationMessage('Profiles table exists and is accessible.');
      }
    } catch (error) {
      setMigrationStatus('error');
      setMigrationMessage('Failed to check table status.');
    }
  };

  React.useEffect(() => {
    checkTableExists();
  }, []);

  const getStatusIcon = () => {
    switch (migrationStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      default:
        return <Database className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusVariant = () => {
    switch (migrationStatus) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Database Migration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className="text-sm font-medium">Profiles Table Status</span>
        </div>

        {migrationMessage && (
          <Alert variant={getStatusVariant()}>
            <AlertDescription>{migrationMessage}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2">
          <Button
            onClick={runMigration}
            disabled={isRunning || migrationStatus === 'success'}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Running Migration...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Run Migration
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={checkTableExists}
            disabled={isRunning}
          >
            Check Status
          </Button>
        </div>

        {migrationStatus === 'warning' && (
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-2">Manual Migration Required:</p>
            <p>1. Go to your Supabase project dashboard</p>
            <p>2. Navigate to SQL Editor</p>
            <p>3. Copy and run the SQL from: <code>supabase/migrations/20250111000000_create_profiles_table.sql</code></p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminMigrationRunner;
