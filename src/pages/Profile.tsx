import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import ProfileCard from '@/components/ProfileCard';
import EditProfileForm from '@/components/EditProfileForm';
import LicenseVerification from '@/components/LicenseVerification';
import { UserProfile } from '@/types/profile';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { checkLicenseExpiry } from '@/services/gumroadService';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = async () => {
    if (!user) return null;
    
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data as UserProfile);
      } else {
        // No profile found, but we'll still show the page with a message
        setProfile({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          avatar_url: user.user_metadata?.avatar_url || '',
          subscription_type: 'free',
          career_status: 'not_specified',
          profile_visibility: 'private',
          email_notifications: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          profile_completion_percentage: 0,
          uploaded_case_study_count: 0,
          is_featured: false,
          is_blocked: false,
          current_company: '',
          current_title: '',
          bio: '',
          skills: [],
          years_of_experience: 0,
          linkedin_url: '',
          portfolio_url: '',
          resume_url: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }

    fetchProfile();
  }, [user, navigate]);

  // Auto-verify license on load
  useEffect(() => {
    const verifyStoredLicense = async () => {
      if (profile?.license_key && user) {
        await checkLicenseExpiry(user.id, profile.license_key);
        await fetchProfile();
      }
    };

    verifyStoredLicense();
  }, [user?.id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = async () => {
    setIsEditing(false);
    await fetchProfile();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Profile</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              View and manage your profile information
            </p>
          </div>

          {isEditing && profile ? (
            <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden p-6">
              <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
              <EditProfileForm 
                profile={profile} 
                onCancel={handleEditCancel}
                onSuccess={handleEditSuccess}
              />
            </div>
          ) : profile ? (
            <>
              <div className="bg-background rounded-lg shadow-sm border border-border overflow-hidden mb-6">
                <ProfileCard 
                  profile={{
                    ...profile,
                    // Ensure we have all required fields with defaults
                    full_name: profile.full_name || '',
                    email: profile.email || user?.email || '',
                    subscription_type: profile.subscription_type || 'free',
                    skills: profile.skills || [],
                    profile_completion_percentage: profile.profile_completion_percentage || 0,
                    current_title: profile.current_title || '',
                    current_company: profile.current_company || '',
                    years_of_experience: profile.years_of_experience || 0,
                    bio: profile.bio || '',
                    linkedin_url: profile.linkedin_url || '',
                    portfolio_url: profile.portfolio_url || '',
                    resume_url: profile.resume_url || '',
                    career_status: profile.career_status || 'not_specified',
                    subscription_start_date: profile.subscription_start_date || null,
                    subscription_end_date: profile.subscription_end_date || null,
                    subscription_updated_at: profile.subscription_updated_at || null,
                  }} 
                  onEdit={handleEdit} 
                />
              </div>
              
              <div className="w-full max-w-3xl mx-auto">
                <LicenseVerification 
                  profile={profile} 
                  onVerificationSuccess={fetchProfile}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12 bg-background rounded-lg border border-border">
              <h3 className="text-lg font-medium text-foreground mb-2">No profile found</h3>
              <p className="text-muted-foreground mb-6">Complete your profile setup to get started.</p>
              <Button onClick={handleEdit}>
                Set Up Profile
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
