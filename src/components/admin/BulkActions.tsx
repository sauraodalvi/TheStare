import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckSquare, 
  Square, 
  Crown, 
  Users, 
  Star, 
  Ban, 
  Calendar,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { AdminUserSummary } from '@/types/profile';
import { AdminProfileService } from '@/services/adminProfileService';

interface BulkActionsProps {
  users: AdminUserSummary[];
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  onRefresh: () => void;
}

type BulkActionType = 'upgrade' | 'downgrade' | 'feature' | 'unfeature' | 'block' | 'unblock';

const BulkActions = ({ users, selectedUsers, onSelectionChange, onRefresh }: BulkActionsProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<BulkActionType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [subscriptionEndDate, setSubscriptionEndDate] = useState('');

  const allSelected = users.length > 0 && selectedUsers.length === users.length;
  const someSelected = selectedUsers.length > 0 && selectedUsers.length < users.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(users.map(user => user.id));
    }
  };

  const handleUserSelection = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedUsers, userId]);
    } else {
      onSelectionChange(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleBulkAction = (action: BulkActionType) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    setCurrentAction(action);
    
    // For upgrade action, we need additional input
    if (action === 'upgrade') {
      // Set default end date to 1 year from now
      const defaultEndDate = new Date();
      defaultEndDate.setFullYear(defaultEndDate.getFullYear() + 1);
      setSubscriptionEndDate(defaultEndDate.toISOString().split('T')[0]);
    }
    
    setIsDialogOpen(true);
  };

  const executeBulkAction = async () => {
    if (!currentAction) return;

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (const userId of selectedUsers) {
        try {
          switch (currentAction) {
            case 'upgrade':
              const endDate = new Date(subscriptionEndDate);
              endDate.setHours(23, 59, 59, 999); // End of day
              await AdminProfileService.upgradeUserToPaid(userId, endDate.toISOString(), 'admin');
              break;
            case 'downgrade':
              await AdminProfileService.downgradeUserToFree(userId, 'admin');
              break;
            case 'feature':
              await AdminProfileService.updateUserProfile(userId, { is_featured: true }, 'admin');
              break;
            case 'unfeature':
              await AdminProfileService.updateUserProfile(userId, { is_featured: false }, 'admin');
              break;
            case 'block':
              await AdminProfileService.updateUserProfile(userId, { is_blocked: true }, 'admin');
              break;
            case 'unblock':
              await AdminProfileService.updateUserProfile(userId, { is_blocked: false }, 'admin');
              break;
          }
          successCount++;
        } catch (error) {
          console.error(`Error processing user ${userId}:`, error);
          errorCount++;
        }
      }

      // Show results
      if (successCount > 0) {
        toast.success(`Successfully processed ${successCount} user${successCount > 1 ? 's' : ''}`);
      }
      if (errorCount > 0) {
        toast.error(`Failed to process ${errorCount} user${errorCount > 1 ? 's' : ''}`);
      }

      // Clear selection and refresh
      onSelectionChange([]);
      onRefresh();
      
    } catch (error) {
      console.error('Bulk action error:', error);
      toast.error('Failed to execute bulk action');
    } finally {
      setIsProcessing(false);
      setIsDialogOpen(false);
      setCurrentAction(null);
    }
  };

  const getActionDescription = () => {
    const count = selectedUsers.length;
    switch (currentAction) {
      case 'upgrade':
        return `Upgrade ${count} user${count > 1 ? 's' : ''} to paid subscription`;
      case 'downgrade':
        return `Downgrade ${count} user${count > 1 ? 's' : ''} to free subscription`;
      case 'feature':
        return `Mark ${count} user${count > 1 ? 's' : ''} as featured`;
      case 'unfeature':
        return `Remove featured status from ${count} user${count > 1 ? 's' : ''}`;
      case 'block':
        return `Block ${count} user${count > 1 ? 's' : ''}`;
      case 'unblock':
        return `Unblock ${count} user${count > 1 ? 's' : ''}`;
      default:
        return '';
    }
  };

  const getSelectedUsersSummary = () => {
    const selectedUserData = users.filter(user => selectedUsers.includes(user.id));
    const freeUsers = selectedUserData.filter(user => user.subscription_type === 'free').length;
    const paidUsers = selectedUserData.filter(user => user.subscription_type === 'paid').length;
    const featuredUsers = selectedUserData.filter(user => user.is_featured).length;
    const blockedUsers = selectedUserData.filter(user => user.is_blocked).length;

    return { freeUsers, paidUsers, featuredUsers, blockedUsers };
  };

  if (users.length === 0) return null;

  const { freeUsers, paidUsers, featuredUsers, blockedUsers } = getSelectedUsersSummary();

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Selection Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  {allSelected ? 'Deselect All' : someSelected ? 'Select All' : 'Select All'}
                </span>
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    {selectedUsers.length} selected
                  </Badge>
                  
                  {freeUsers > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      {freeUsers} free
                    </Badge>
                  )}
                  
                  {paidUsers > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      {paidUsers} paid
                    </Badge>
                  )}
                  
                  {featuredUsers > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {featuredUsers} featured
                    </Badge>
                  )}
                  
                  {blockedUsers > 0 && (
                    <Badge variant="outline" className="text-xs">
                      <Ban className="w-3 h-3 mr-1" />
                      {blockedUsers} blocked
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('upgrade')}
                  disabled={selectedUsers.length === 0}
                >
                  <Crown className="w-3 h-3 mr-1" />
                  Upgrade
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('downgrade')}
                  disabled={selectedUsers.length === 0}
                >
                  <Users className="w-3 h-3 mr-1" />
                  Downgrade
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('feature')}
                  disabled={selectedUsers.length === 0}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Feature
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('unfeature')}
                  disabled={selectedUsers.length === 0}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Unfeature
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('block')}
                  disabled={selectedUsers.length === 0}
                >
                  <Ban className="w-3 h-3 mr-1" />
                  Block
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('unblock')}
                  disabled={selectedUsers.length === 0}
                >
                  <Ban className="w-3 h-3 mr-1" />
                  Unblock
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Confirm Bulk Action
            </DialogTitle>
            <DialogDescription>
              {getActionDescription()}
            </DialogDescription>
          </DialogHeader>

          {currentAction === 'upgrade' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">Subscription End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={subscriptionEndDate}
                  onChange={(e) => setSubscriptionEndDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            This action will affect {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} and cannot be undone.
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={executeBulkAction}
              disabled={isProcessing || (currentAction === 'upgrade' && !subscriptionEndDate)}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkActions;
