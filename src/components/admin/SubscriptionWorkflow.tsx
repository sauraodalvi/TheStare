import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Crown, 
  Users, 
  Calendar, 
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminProfileService } from '@/services/adminProfileService';
import { AdminUserSummary } from '@/types/profile';
import { format, addMonths, addYears } from 'date-fns';

interface SubscriptionWorkflowProps {
  user: AdminUserSummary;
  onUpdate: () => void;
}

const SubscriptionWorkflow = ({ user, onUpdate }: SubscriptionWorkflowProps) => {
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [isDowngradeDialogOpen, setIsDowngradeDialogOpen] = useState(false);
  const [subscriptionDuration, setSubscriptionDuration] = useState('12'); // months
  const [customEndDate, setCustomEndDate] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const getSubscriptionStatus = () => {
    if (user.subscription_type !== 'paid' || !user.subscription_end_date) {
      return { status: 'free', variant: 'secondary' as const, label: 'Free User' };
    }
    
    const endDate = new Date(user.subscription_end_date);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) {
      return { status: 'expired', variant: 'destructive' as const, label: 'Expired' };
    } else if (daysUntilExpiry <= 7) {
      return { status: 'critical', variant: 'destructive' as const, label: `${daysUntilExpiry}d left` };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'warning', variant: 'secondary' as const, label: 'Expiring Soon' };
    }
    
    return { status: 'active', variant: 'default' as const, label: 'Active' };
  };

  const calculateEndDate = (duration: string) => {
    const now = new Date();
    switch (duration) {
      case '1':
        return addMonths(now, 1);
      case '3':
        return addMonths(now, 3);
      case '6':
        return addMonths(now, 6);
      case '12':
        return addYears(now, 1);
      case 'custom':
        return customEndDate ? new Date(customEndDate) : addYears(now, 1);
      default:
        return addYears(now, 1);
    }
  };

  const handleUpgrade = async () => {
    setIsProcessing(true);
    try {
      const endDate = calculateEndDate(subscriptionDuration);
      await AdminProfileService.upgradeUserToPaid(user.id, endDate.toISOString(), 'admin');
      toast.success(`${user.email} upgraded to paid subscription`);
      onUpdate();
      setIsUpgradeDialogOpen(false);
    } catch (error) {
      console.error('Error upgrading user:', error);
      toast.error('Failed to upgrade user');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDowngrade = async () => {
    setIsProcessing(true);
    try {
      await AdminProfileService.downgradeUserToFree(user.id, 'admin');
      toast.success(`${user.email} downgraded to free subscription`);
      onUpdate();
      setIsDowngradeDialogOpen(false);
    } catch (error) {
      console.error('Error downgrading user:', error);
      toast.error('Failed to downgrade user');
    } finally {
      setIsProcessing(false);
    }
  };

  const subscriptionStatus = getSubscriptionStatus();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Status */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              {user.subscription_type === 'paid' ? (
                <Crown className="w-5 h-5 text-primary" />
              ) : (
                <Users className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium">
                  {user.subscription_type === 'paid' ? 'Paid Subscription' : 'Free Account'}
                </p>
                {user.subscription_end_date && (
                  <p className="text-sm text-muted-foreground">
                    Expires: {format(new Date(user.subscription_end_date), 'MMM dd, yyyy')}
                  </p>
                )}
              </div>
            </div>
            <Badge variant={subscriptionStatus.variant}>
              {subscriptionStatus.label}
            </Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            {user.subscription_type === 'free' ? (
              <Button
                onClick={() => setIsUpgradeDialogOpen(true)}
                className="flex-1"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Paid
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsUpgradeDialogOpen(true)}
                  className="flex-1"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Extend Subscription
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDowngradeDialogOpen(true)}
                  className="flex-1"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Downgrade to Free
                </Button>
              </>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.uploaded_case_study_count}</div>
              <div className="text-sm text-muted-foreground">Case Studies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{user.profile_completion_percentage}%</div>
              <div className="text-sm text-muted-foreground">Profile Complete</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Dialog */}
      <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              {user.subscription_type === 'free' ? 'Upgrade to Paid' : 'Extend Subscription'}
            </DialogTitle>
            <DialogDescription>
              {user.subscription_type === 'free' 
                ? `Upgrade ${user.email} to a paid subscription`
                : `Extend ${user.email}'s subscription period`
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subscription Duration</Label>
              <Select value={subscriptionDuration} onValueChange={setSubscriptionDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">1 Year (Recommended)</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {subscriptionDuration === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="customEndDate">End Date</Label>
                <Input
                  id="customEndDate"
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            )}

            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">New End Date</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {format(calculateEndDate(subscriptionDuration), 'MMMM dd, yyyy')}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpgradeDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing || (subscriptionDuration === 'custom' && !customEndDate)}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {user.subscription_type === 'free' ? 'Upgrade' : 'Extend'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downgrade Dialog */}
      <Dialog open={isDowngradeDialogOpen} onOpenChange={setIsDowngradeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Downgrade to Free
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to downgrade {user.email} to a free account?
              This action will immediately remove their paid subscription benefits.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">This will:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Remove access to paid features</li>
                  <li>Clear the subscription end date</li>
                  <li>Cannot be undone automatically</li>
                </ul>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDowngradeDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDowngrade}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Downgrade'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SubscriptionWorkflow;
