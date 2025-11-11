import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserProfile } from '@/types/profile';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface EditProfileFormProps {
  profile: UserProfile;
  onCancel: () => void;
  onSuccess: () => void;
}

const EditProfileForm = ({ profile, onCancel, onSuccess }: EditProfileFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use a more defensive approach with field names
  // Use the correct field names from the database schema
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    bio: profile?.bio || '',
    current_title: profile?.current_title || '',
    current_company: profile?.current_company || '',
    skills: (Array.isArray(profile?.skills) ? profile.skills : []).join(', '),
    linkedin_url: profile?.linkedin_url || '',
    portfolio_url: profile?.portfolio_url || '',
    resume_url: profile?.resume_url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      console.error('No user found');
      toast({
        title: 'Error',
        description: 'You must be logged in to update your profile.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('Form data before processing:', formData);
      
      // Prepare all updates with correct field names
      const updates = {
        full_name: formData.full_name.trim(),
        bio: formData.bio.trim(),
        current_title: formData.current_title.trim() || null,
        current_company: formData.current_company.trim() || null,
        skills: formData.skills
          .split(',')
          .map(skill => skill.trim())
          .filter(Boolean),
        linkedin_url: formData.linkedin_url.trim() || null,
        portfolio_url: formData.portfolio_url.trim() || null,
        resume_url: formData.resume_url.trim() || null,
        updated_at: new Date().toISOString()
      };

      console.log('Sending update:', updates);
      
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select();

      console.log('Update response:', { data, error });

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Profile update successful:', data);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      
      // Add a small delay to ensure the toast is visible before navigating
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess();
    } catch (error: any) {
      console.error('Error updating profile:', error);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current_title">Job Title</Label>
            <Input
              id="current_title"
              name="current_title"
              value={formData.current_title}
              onChange={handleChange}
              placeholder="e.g., Product Manager"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="current_company">Company</Label>
            <Input
              id="current_company"
              name="current_company"
              value={formData.current_company}
              onChange={handleChange}
              placeholder="e.g., Tech Corp"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., Product Strategy, UX Design, Data Analysis"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="linkedin_url">LinkedIn URL</Label>
            <Input
              id="linkedin_url"
              name="linkedin_url"
              type="url"
              value={formData.linkedin_url}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="portfolio_url">Portfolio URL</Label>
            <Input
              id="portfolio_url"
              name="portfolio_url"
              type="url"
              value={formData.portfolio_url}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resume_url">Resume URL (optional)</Label>
            <Input
              id="resume_url"
              name="resume_url"
              type="url"
              value={formData.resume_url}
              onChange={handleChange}
              placeholder="https://yourresume.com"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              placeholder="Tell us about yourself..."
              className="min-h-[120px]"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
