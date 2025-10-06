import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Edit, Crown, ArrowUpRight } from 'lucide-react';
import { UserProfile } from '@/types/profile';
import { useNavigate } from 'react-router-dom';

interface ProfileCardProps {
  profile: UserProfile;
  onEdit?: () => void;
}

const calculateCompletionPercentage = (profile: UserProfile) => {
  const fields = [
    profile.full_name,
    profile.bio,
    profile.current_title,
    profile.current_company,
    profile.skills?.length > 0 ? profile.skills : null,
    profile.linkedin_url,
    profile.portfolio_url,
    profile.resume_url
  ];
  
  const filledFields = fields.filter(field => {
    if (Array.isArray(field)) return field.length > 0;
    return field && field.toString().trim() !== '';
  }).length;
  
  return Math.round((filledFields / fields.length) * 100);
};

const ProfileCard = ({ profile, onEdit }: ProfileCardProps) => {
  const navigate = useNavigate();
  const completionPercentage = calculateCompletionPercentage(profile);
  const isPaid = (profile.subscription_type as any) === 1 || profile.subscription_type === 'paid';
  
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  const handleUpgradeClick = () => {
    navigate('/pricing');
  };
  
  const formatSubscriptionDate = (dateString?: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-border">
      <CardHeader className="border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
              ) : (
                <AvatarFallback className="text-xl font-medium">
                  {getInitials(profile.full_name || profile.email || 'U')}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold">
                {profile.full_name || 'No Name'}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          {onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 self-start sm:self-center"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Profile Completion */}
        <div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-medium text-foreground">
                {completionPercentage}%
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            {completionPercentage < 100 && (
              <p className="text-xs text-muted-foreground">
                Complete your profile to unlock all features
              </p>
            )}
          </div>
        </div>

        {/* Current Role */}
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Role</h3>
            <p className="text-foreground">
              {profile.current_title || 'Not specified'}
              {profile.current_company && ` at ${profile.current_company}`}
            </p>
          </div>

          {/* Experience */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">Experience</h3>
            <p className="text-foreground">
              {profile.years_of_experience 
                ? `${profile.years_of_experience} year${profile.years_of_experience !== 1 ? 's' : ''} experience`
                : 'Not specified'}
            </p>
          </div>
        </div>

        {/* Career Status */}
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Career Status</h3>
          <p className="text-foreground">
            {profile.career_status || 'Not specified'}
          </p>
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1 text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">About</h3>
            <p className="text-foreground whitespace-pre-line">{profile.bio}</p>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4 pt-2">
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              LinkedIn <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
          {profile.portfolio_url && (
            <a
              href={profile.portfolio_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              Portfolio <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-primary hover:underline"
            >
              Resume <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          )}
        </div>

        {/* Subscription Status */}
        <div className="pt-2">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Badge variant={isPaid ? 'default' : 'outline'} className="text-sm">
                {isPaid ? (
                  <span className="flex items-center gap-1">
                    <Crown className="h-3.5 w-3.5 mr-1" />
                    Premium Member
                  </span>
                ) : 'Free Plan'}
              </Badge>
              
              {isPaid && profile.subscription_end_date && (
                <span className="text-xs text-muted-foreground">
                  Renews on {formatSubscriptionDate(profile.subscription_end_date)}
                </span>
              )}
            </div>
            
              {isPaid ? (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full justify-between"
                    onClick={handleUpgradeClick}
                  >
                    <span>Extend Subscription</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={handleUpgradeClick}
                >
                  <Crown className="h-4 w-4" />
                  Upgrade to Premium
                </Button>
              )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
