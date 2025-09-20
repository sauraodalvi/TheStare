import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  User,
  Mail,
  Calendar,
  Star,
  Shield,
  ExternalLink,
  MoreHorizontal,
  Crown,
  Ban,
  AlertTriangle
} from 'lucide-react';
import { AdminUserSummary, SubscriptionType, CareerStatus } from '@/types/profile';
import { formatDistanceToNow } from 'date-fns';

interface UserCardProps {
  user: AdminUserSummary;
  isSelected?: boolean;
  onSelectionChange?: (userId: string, selected: boolean) => void;
  onViewProfile: (userId: string) => void;
  onToggleFeatured: (userId: string) => void;
  onToggleBlocked: (userId: string) => void;
  onUpgradeSubscription: (userId: string) => void;
  onDowngradeSubscription: (userId: string) => void;
}

const UserCard = ({
  user,
  isSelected = false,
  onSelectionChange,
  onViewProfile,
  onToggleFeatured,
  onToggleBlocked,
  onUpgradeSubscription,
  onDowngradeSubscription
}: UserCardProps) => {
  const getSubscriptionBadgeVariant = (type: SubscriptionType) => {
    return type === 'paid' ? 'default' : 'secondary';
  };

  const getCareerStatusBadgeVariant = (status: CareerStatus) => {
    switch (status) {
      case 'job_seeker':
        return 'outline';
      case 'hiring':
        return 'default';
      case 'employed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getCareerStatusLabel = (status: CareerStatus) => {
    switch (status) {
      case 'job_seeker':
        return 'Job Seeker';
      case 'hiring':
        return 'Hiring';
      case 'employed':
        return 'Employed';
      default:
        return 'Not Specified';
    }
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Never';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  const getSubscriptionStatus = () => {
    if (user.subscription_type !== 'paid' || !user.subscription_end_date) return null;

    const endDate = new Date(user.subscription_end_date);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry <= 0) {
      return { status: 'expired', days: daysUntilExpiry, variant: 'destructive' as const };
    } else if (daysUntilExpiry <= 7) {
      return { status: 'critical', days: daysUntilExpiry, variant: 'destructive' as const };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'warning', days: daysUntilExpiry, variant: 'secondary' as const };
    }

    return null;
  };

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <Card className={`bg-card hover:shadow-lg transition-all duration-300 border border-border overflow-hidden h-full flex flex-col group ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4 sm:p-5 flex-1 flex flex-col">
        {/* Selection Checkbox */}
        {onSelectionChange && (
          <div className="flex justify-end mb-2">
            <Checkbox
              checked={isSelected}
              onCheckedChange={(checked) => onSelectionChange(user.id, checked as boolean)}
            />
          </div>
        )}

        {/* Header with Avatar and Status Indicators */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || user.email} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {getInitials(user.full_name, user.email)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate">
                {user.full_name || 'Unnamed User'}
              </h3>
              <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {user.email}
              </p>
            </div>
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1">
            {user.is_featured && (
              <Star className="w-4 h-4 text-amber-500" />
            )}
            {user.is_blocked && (
              <Ban className="w-4 h-4 text-red-500" />
            )}
            {user.subscription_type === 'paid' && (
              <Crown className="w-4 h-4 text-primary" />
            )}
          </div>
        </div>

        {/* Subscription and Career Status */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={getSubscriptionBadgeVariant(user.subscription_type)}>
            {user.subscription_type === 'paid' ? 'Paid' : 'Free'}
          </Badge>
          
          <Badge variant={getCareerStatusBadgeVariant(user.career_status)}>
            {getCareerStatusLabel(user.career_status)}
          </Badge>

          {subscriptionStatus && (
            <Badge variant={subscriptionStatus.variant} className="text-xs flex items-center gap-1">
              {subscriptionStatus.status === 'expired' && <AlertTriangle className="w-3 h-3" />}
              {subscriptionStatus.status === 'critical' && <AlertTriangle className="w-3 h-3" />}
              {subscriptionStatus.status === 'expired'
                ? 'Expired'
                : subscriptionStatus.status === 'critical'
                ? `${subscriptionStatus.days}d left`
                : 'Expiring Soon'
              }
            </Badge>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="font-semibold text-foreground">{user.uploaded_case_study_count}</div>
            <div className="text-muted-foreground text-xs">Case Studies</div>
          </div>
          
          <div className="text-center p-2 bg-muted/50 rounded-lg">
            <div className="font-semibold text-foreground">{user.profile_completion_percentage}%</div>
            <div className="text-muted-foreground text-xs">Profile Complete</div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-1 text-xs text-muted-foreground mb-4 flex-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>Joined {formatDate(user.created_at)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>Last seen {formatDate(user.last_login_at)}</span>
          </div>
          {user.subscription_end_date && user.subscription_type === 'paid' && (
            <div className="flex items-center gap-1">
              <Crown className="w-3 h-3" />
              <span>Expires {formatDate(user.subscription_end_date)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewProfile(user.id)}
            className="w-full flex items-center gap-2"
          >
            <ExternalLink className="w-3 h-3" />
            View Profile
          </Button>

          <div className="flex gap-2">
            {user.subscription_type === 'free' ? (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Upgrade ${user.email} to a paid subscription?`)) {
                    onUpgradeSubscription(user.id)
                  }
                }}
                className="flex-1 text-xs"
              >
                Upgrade to Paid
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Downgrade ${user.email} to a free subscription? This will remove paid benefits immediately.`)) {
                    onDowngradeSubscription(user.id)
                  }
                }}
                className="flex-1 text-xs"
              >
                Downgrade to Free
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const action = user.is_featured ? 'remove Featured from' : 'mark as Featured'
                if (window.confirm(`Are you sure you want to ${action} ${user.email}?`)) {
                  onToggleFeatured(user.id)
                }
              }}
              className={`px-2 ${user.is_featured ? 'text-amber-600 border-amber-200' : ''}`}
            >
              <Star className={`w-3 h-3 ${user.is_featured ? 'fill-current' : ''}`} />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const action = user.is_blocked ? 'unblock' : 'block'
                if (window.confirm(`Are you sure you want to ${action} ${user.email}?`)) {
                  onToggleBlocked(user.id)
                }
              }}
              className={`px-2 ${user.is_blocked ? 'text-red-600 border-red-200' : ''}`}
            >
              <Ban className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
