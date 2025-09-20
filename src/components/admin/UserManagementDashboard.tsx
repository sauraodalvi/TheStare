import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Users, Crown, Star, Ban, TrendingUp, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import UserCard from './UserCard';
import UserFilters from './UserFilters';
import BulkActions from './BulkActions';
import UserProfileModal from './UserProfileModal';
import AnalyticsDashboard from './AnalyticsDashboard';
import { AdminProfileService } from '@/services/adminProfileService';
import { AdminUserSummary, UserSearchParams, UserAnalytics, UserFilters as UserFiltersType } from '@/types/profile';

const UserManagementDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<UserFiltersType>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<UserSearchParams>({
    page: 1,
    limit: 20,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  // Update search params when filters change
  useEffect(() => {
    setSearchParams(prev => ({
      ...prev,
      query: searchQuery.trim() || undefined,
      filters,
      page: 1 // Reset to first page when filters change
    }));
  }, [searchQuery, filters]);

  // Fetch users
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: ['admin-users', searchParams],
    queryFn: () => AdminProfileService.getUsers(searchParams),
  });

  // Fetch analytics
  const { 
    data: analytics, 
    isLoading: isLoadingAnalytics,
    refetch: refetchAnalytics 
  } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => AdminProfileService.getUserAnalytics(),
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Handle filters
  const handleFiltersChange = (newFilters: UserFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setSelectedUsers([]);
  };

  // Handle sorting
  const handleSortChange = (sortBy: string) => {
    const [field, order] = sortBy.split('-');
    setSearchParams(prev => ({
      ...prev,
      sort_by: field as any,
      sort_order: order as 'asc' | 'desc',
      page: 1
    }));
  };

  // Handle user actions
  const handleViewProfile = (userId: string) => {
    setSelectedProfileUserId(userId);
  };

  const handleToggleFeatured = async (userId: string) => {
    try {
      await AdminProfileService.toggleUserFeatured(userId, 'admin'); // TODO: Get actual admin ID
      toast.success('User featured status updated');
      refetchUsers();
      refetchAnalytics();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  const handleToggleBlocked = async (userId: string) => {
    try {
      await AdminProfileService.toggleUserBlocked(userId, 'admin'); // TODO: Get actual admin ID
      toast.success('User blocked status updated');
      refetchUsers();
      refetchAnalytics();
    } catch (error) {
      console.error('Error toggling blocked status:', error);
      toast.error('Failed to update blocked status');
    }
  };

  const handleUpgradeSubscription = async (userId: string) => {
    try {
      // Set subscription to expire in 1 year
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      
      await AdminProfileService.upgradeUserToPaid(userId, endDate.toISOString(), 'admin');
      toast.success('User upgraded to paid subscription');
      refetchUsers();
      refetchAnalytics();
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      toast.error('Failed to upgrade subscription');
    }
  };

  const handleDowngradeSubscription = async (userId: string) => {
    try {
      await AdminProfileService.downgradeUserToFree(userId, 'admin');
      toast.success('User downgraded to free subscription');
      refetchUsers();
      refetchAnalytics();
    } catch (error) {
      console.error('Error downgrading subscription:', error);
      toast.error('Failed to downgrade subscription');
    }
  };

  const handleLoadMore = () => {
    setSearchParams(prev => ({
      ...prev,
      page: (prev.page || 1) + 1
    }));
  };

  // Handle user selection for bulk actions
  const handleUserSelection = (userId: string, selected: boolean) => {
    if (selected) {
      setSelectedUsers(prev => [...prev, userId]);
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId));
    }
  };

  const handleBulkRefresh = () => {
    refetchUsers();
    refetchAnalytics();
    setSelectedUsers([]);
  };

  if (isLoadingUsers && !usersData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading users...</span>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="text-center py-12">
        <div className="text-destructive">
          <p className="text-lg font-medium">Failed to load users</p>
          <p className="text-sm text-muted-foreground mt-2">
            {usersError instanceof Error ? usersError.message : 'Unknown error occurred'}
          </p>
          <Button onClick={() => refetchUsers()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const users = usersData?.data || [];
  const totalCount = usersData?.totalCount || 0;
  const hasMore = usersData?.hasMore || false;

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard */}
      <AnalyticsDashboard
        analytics={analytics || {
          total_users: 0,
          free_users: 0,
          paid_users: 0,
          active_users_30d: 0,
          new_users_30d: 0,
          featured_users: 0,
          blocked_users: 0,
          avg_profile_completion: 0,
          total_case_studies_uploaded: 0,
          career_status_breakdown: {
            job_seeker: 0,
            hiring: 0,
            employed: 0,
            not_specified: 0,
          },
          subscription_expiring_soon: 0,
        }}
        isLoading={isLoadingAnalytics}
      />

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            {/* Search and Sort Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, email, company..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select
                  value={`${searchParams.sort_by}-${searchParams.sort_order}`}
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at-desc">Newest First</SelectItem>
                    <SelectItem value="created_at-asc">Oldest First</SelectItem>
                    <SelectItem value="last_login_at-desc">Recently Active</SelectItem>
                    <SelectItem value="last_login_at-asc">Least Active</SelectItem>
                    <SelectItem value="subscription_end_date-asc">Expiring Soon</SelectItem>
                    <SelectItem value="profile_completion_percentage-desc">Most Complete</SelectItem>
                    <SelectItem value="uploaded_case_study_count-desc">Most Case Studies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filters */}
            <UserFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              totalResults={totalCount}
            />
          </div>

          {/* Bulk Actions */}
          <BulkActions
            users={users}
            selectedUsers={selectedUsers}
            onSelectionChange={setSelectedUsers}
            onRefresh={handleBulkRefresh}
          />

          {/* Users Grid */}
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-muted-foreground mb-2">No users found</p>
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'Try adjusting your search criteria' : 'No users have been created yet'}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                {users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    isSelected={selectedUsers.includes(user.id)}
                    onSelectionChange={handleUserSelection}
                    onViewProfile={handleViewProfile}
                    onToggleFeatured={handleToggleFeatured}
                    onToggleBlocked={handleToggleBlocked}
                    onUpgradeSubscription={handleUpgradeSubscription}
                    onDowngradeSubscription={handleDowngradeSubscription}
                  />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-8">
                  <Button 
                    onClick={handleLoadMore}
                    variant="outline"
                    size="lg"
                    className="px-8"
                    disabled={isLoadingUsers}
                  >
                    {isLoadingUsers ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading more...
                      </>
                    ) : (
                      'Load More Users'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* User Profile Modal */}
      <UserProfileModal
        userId={selectedProfileUserId}
        isOpen={!!selectedProfileUserId}
        onClose={() => setSelectedProfileUserId(null)}
        onRefresh={handleBulkRefresh}
      />
    </div>
  );
};

export default UserManagementDashboard;
