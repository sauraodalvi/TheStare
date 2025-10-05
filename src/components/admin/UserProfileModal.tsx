import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Star, 
  Crown, 
  Ban, 
  ExternalLink,
  Edit3,
  Save,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Briefcase,
  Globe,
  FileText,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminProfileService } from '@/services/adminProfileService';
import { UserProfile, UpdateUserProfile, SubscriptionType, CareerStatus, AdminUserSummary } from '@/types/profile';
import { formatDistanceToNow } from 'date-fns';
import SubscriptionWorkflow from './SubscriptionWorkflow';

interface UserProfileModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

const UserProfileModal = ({ userId, isOpen, onClose, onRefresh }: UserProfileModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UpdateUserProfile>>({});
  const queryClient = useQueryClient();

  // Fetch user profile
  const { 
    data: profile, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => userId ? AdminProfileService.getUserProfile(userId) : null,
    enabled: !!userId && isOpen,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: UpdateUserProfile }) =>
      AdminProfileService.updateUserProfile(userId, updates, 'admin'),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      setIsEditing(false);
      setEditedProfile({});
      queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      onRefresh?.();
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    },
  });

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      setEditedProfile({});
      setIsEditing(false);
    }
  }, [profile]);

  const handleSave = () => {
    if (!userId || !profile) return;

    // Only send changed fields
    const updates = Object.keys(editedProfile).reduce((acc, key) => {
      const typedKey = key as keyof UpdateUserProfile;
      if (editedProfile[typedKey] !== undefined) {
        (acc as any)[typedKey] = editedProfile[typedKey];
      }
      return acc;
    }, {} as UpdateUserProfile);

    if (Object.keys(updates).length === 0) {
      setIsEditing(false);
      return;
    }

    updateProfileMutation.mutate({ userId, updates });
  };

  const handleCancel = () => {
    setEditedProfile({});
    setIsEditing(false);
  };

  const handleFieldChange = (field: keyof UpdateUserProfile, value: any) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFieldValue = (field: keyof UpdateUserProfile) => {
    return editedProfile[field] !== undefined ? editedProfile[field] : profile?.[field];
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getCareerStatusOptions = (): { value: CareerStatus; label: string }[] => [
    { value: 'job_seeker', label: 'Job Seeker' },
    { value: 'hiring', label: 'Hiring' },
    { value: 'employed', label: 'Employed' },
    { value: 'not_specified', label: 'Not Specified' },
  ];

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading profile...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !profile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <h3 className="text-lg font-semibold mb-2">Failed to load profile</h3>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'User profile not found'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              User Profile
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    disabled={updateProfileMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-1" />
                    )}
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4 mr-1" />
                  Edit Profile
                </Button>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || profile.email || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                    {getInitials(profile.full_name, profile.email)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="full_name"
                          value={(getFieldValue('full_name') as string) || ''}
                          onChange={(e) => handleFieldChange('full_name', e.target.value)}
                          placeholder="Enter full name"
                        />
                      ) : (
                        <p className="text-sm font-medium">{profile.full_name || 'Not provided'}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {profile.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant={profile.subscription_type === 'paid' ? 'default' : 'secondary'}>
                      {profile.subscription_type === 'paid' ? (
                        <>
                          <Crown className="w-3 h-3 mr-1" />
                          Paid
                        </>
                      ) : (
                        <>
                          <Users className="w-3 h-3 mr-1" />
                          Free
                        </>
                      )}
                    </Badge>

                    {profile.is_featured && (
                      <Badge variant="outline">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}

                    {profile.is_blocked && (
                      <Badge variant="destructive">
                        <Ban className="w-3 h-3 mr-1" />
                        Blocked
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Profile Completion
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={profile.profile_completion_percentage} className="w-20" />
                    <span className="text-sm font-medium">{profile.profile_completion_percentage}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="current_title">Current Title</Label>
                  {isEditing ? (
                    <Input
                      id="current_title"
                      value={(getFieldValue('current_title') as string) || ''}
                      onChange={(e) => handleFieldChange('current_title', e.target.value)}
                      placeholder="e.g., Product Manager"
                    />
                  ) : (
                    <p className="text-sm">{profile.current_title || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current_company">Current Company</Label>
                  {isEditing ? (
                    <Input
                      id="current_company"
                      value={(getFieldValue('current_company') as string) || ''}
                      onChange={(e) => handleFieldChange('current_company', e.target.value)}
                      placeholder="e.g., Google"
                    />
                  ) : (
                    <p className="text-sm">{profile.current_company || 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="years_of_experience">Years of Experience</Label>
                  {isEditing ? (
                    <Input
                      id="years_of_experience"
                      type="number"
                      min="0"
                      max="50"
                      value={(getFieldValue('years_of_experience') as number) || ''}
                      onChange={(e) => handleFieldChange('years_of_experience', parseInt(e.target.value) || null)}
                      placeholder="e.g., 5"
                    />
                  ) : (
                    <p className="text-sm">{profile.years_of_experience ? `${profile.years_of_experience} years` : 'Not provided'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="career_status">Career Status</Label>
                  {isEditing ? (
                    <Select
                      value={(getFieldValue('career_status') as CareerStatus) || 'not_specified'}
                      onValueChange={(value) => handleFieldChange('career_status', value as CareerStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getCareerStatusOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm">
                      {getCareerStatusOptions().find(opt => opt.value === profile.career_status)?.label || 'Not specified'}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={(getFieldValue('bio') as string) || ''}
                    onChange={(e) => handleFieldChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{profile.bio || 'No bio provided'}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Links and Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Links & Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio_url">Portfolio URL</Label>
                  {isEditing ? (
                    <Input
                      id="portfolio_url"
                      type="url"
                      value={(getFieldValue('portfolio_url') as string) || ''}
                      onChange={(e) => handleFieldChange('portfolio_url', e.target.value)}
                      placeholder="https://yourportfolio.com"
                    />
                  ) : (
                    <div className="text-sm">
                      {profile.portfolio_url ? (
                        <a 
                          href={profile.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Portfolio
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  {isEditing ? (
                    <Input
                      id="linkedin_url"
                      type="url"
                      value={(getFieldValue('linkedin_url') as string) || ''}
                      onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                  ) : (
                    <div className="text-sm">
                      {profile.linkedin_url ? (
                        <a 
                          href={profile.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View LinkedIn
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resume_url">Resume URL</Label>
                  {isEditing ? (
                    <Input
                      id="resume_url"
                      type="url"
                      value={(getFieldValue('resume_url') as string) || ''}
                      onChange={(e) => handleFieldChange('resume_url', e.target.value)}
                      placeholder="https://drive.google.com/..."
                    />
                  ) : (
                    <div className="text-sm">
                      {profile.resume_url ? (
                        <a 
                          href={profile.resume_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          View Resume
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SubscriptionWorkflow
              user={profile as AdminUserSummary}
              onUpdate={() => {
                queryClient.invalidateQueries({ queryKey: ['user-profile', userId] });
                queryClient.invalidateQueries({ queryKey: ['admin-users'] });
                queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
                onRefresh?.();
              }}
            />

            {/* Activity & Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Activity & Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{profile.uploaded_case_study_count}</div>
                    <div className="text-sm text-muted-foreground">Case Studies</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{profile.profile_completion_percentage}%</div>
                    <div className="text-sm text-muted-foreground">Profile Complete</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium">Joined</div>
                    <div className="text-xs text-muted-foreground">{formatDate(profile.created_at)}</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium">Last Seen</div>
                    <div className="text-xs text-muted-foreground">{formatDate(profile.last_login_at)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Admin Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="admin_notes">Internal Notes</Label>
                {isEditing ? (
                  <Textarea
                    id="admin_notes"
                    value={(getFieldValue('admin_notes') as string) || ''}
                    onChange={(e) => handleFieldChange('admin_notes', e.target.value)}
                    placeholder="Add internal notes about this user..."
                    rows={3}
                  />
                ) : (
                  <p className="text-sm whitespace-pre-wrap text-muted-foreground">
                    {profile.admin_notes || 'No admin notes'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
