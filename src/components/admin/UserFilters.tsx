import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon, 
  Crown, 
  Users, 
  Briefcase,
  Star,
  Ban,
  RotateCcw
} from 'lucide-react';
import { format } from 'date-fns';
import { UserFilters as UserFiltersType, SubscriptionType, CareerStatus } from '@/types/profile';

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  onClearFilters: () => void;
  totalResults: number;
}

const UserFilters = ({ filters, onFiltersChange, onClearFilters, totalResults }: UserFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const subscriptionTypes: { value: SubscriptionType; label: string; icon: React.ReactNode }[] = [
    { value: 'free', label: 'Free Users', icon: <Users className="w-4 h-4" /> },
    { value: 'paid', label: 'Paid Users', icon: <Crown className="w-4 h-4" /> },
  ];

  const careerStatuses: { value: CareerStatus; label: string; icon: React.ReactNode }[] = [
    { value: 'job_seeker', label: 'Job Seekers', icon: <Briefcase className="w-4 h-4" /> },
    { value: 'hiring', label: 'Hiring', icon: <Users className="w-4 h-4" /> },
    { value: 'employed', label: 'Employed', icon: <Briefcase className="w-4 h-4" /> },
    { value: 'not_specified', label: 'Not Specified', icon: <Users className="w-4 h-4" /> },
  ];

  const handleSubscriptionTypeChange = (type: SubscriptionType, checked: boolean) => {
    const currentTypes = filters.subscription_type || [];
    const newTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    onFiltersChange({
      ...filters,
      subscription_type: newTypes.length > 0 ? newTypes : undefined
    });
  };

  const handleCareerStatusChange = (status: CareerStatus, checked: boolean) => {
    const currentStatuses = filters.career_status || [];
    const newStatuses = checked 
      ? [...currentStatuses, status]
      : currentStatuses.filter(s => s !== status);
    
    onFiltersChange({
      ...filters,
      career_status: newStatuses.length > 0 ? newStatuses : undefined
    });
  };

  const handleDateChange = (field: 'created_after' | 'created_before' | 'last_login_after' | 'last_login_before', date: Date | undefined) => {
    onFiltersChange({
      ...filters,
      [field]: date ? date.toISOString() : undefined
    });
  };

  const handleNumberChange = (field: 'min_case_studies' | 'min_profile_completion', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value, 10);
    onFiltersChange({
      ...filters,
      [field]: numValue
    });
  };

  const handleBooleanChange = (field: 'is_featured' | 'is_blocked', value: string) => {
    const boolValue = value === 'all' ? undefined : value === 'true';
    onFiltersChange({
      ...filters,
      [field]: boolValue
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.subscription_type?.length) count++;
    if (filters.career_status?.length) count++;
    if (filters.is_featured !== undefined) count++;
    if (filters.is_blocked !== undefined) count++;
    if (filters.created_after) count++;
    if (filters.created_before) count++;
    if (filters.last_login_after) count++;
    if (filters.last_login_before) count++;
    if (filters.min_case_studies !== undefined) count++;
    if (filters.min_profile_completion !== undefined) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  const formatDate = (dateString?: string) => {
    if (!dateString) return undefined;
    try {
      return new Date(dateString);
    } catch {
      return undefined;
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Toggle Button */}
      <div className="flex items-center justify-between">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="start">
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Filter Users
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClearFilters}
                    className="h-8 px-2 text-xs"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subscription Type */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Subscription Type</Label>
                  <div className="space-y-2">
                    {subscriptionTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`subscription-${type.value}`}
                          checked={filters.subscription_type?.includes(type.value) || false}
                          onCheckedChange={(checked) => 
                            handleSubscriptionTypeChange(type.value, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`subscription-${type.value}`}
                          className="text-sm flex items-center gap-2 cursor-pointer"
                        >
                          {type.icon}
                          {type.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Career Status */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Career Status</Label>
                  <div className="space-y-2">
                    {careerStatuses.map((status) => (
                      <div key={status.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`career-${status.value}`}
                          checked={filters.career_status?.includes(status.value) || false}
                          onCheckedChange={(checked) => 
                            handleCareerStatusChange(status.value, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`career-${status.value}`}
                          className="text-sm flex items-center gap-2 cursor-pointer"
                        >
                          {status.icon}
                          {status.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Status */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Special Status</Label>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Featured Status</Label>
                      <Select
                        value={filters.is_featured === undefined ? 'all' : filters.is_featured.toString()}
                        onValueChange={(value) => handleBooleanChange('is_featured', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="true">
                            <div className="flex items-center gap-2">
                              <Star className="w-3 h-3" />
                              Featured Only
                            </div>
                          </SelectItem>
                          <SelectItem value="false">Non-Featured Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Blocked Status</Label>
                      <Select
                        value={filters.is_blocked === undefined ? 'all' : filters.is_blocked.toString()}
                        onValueChange={(value) => handleBooleanChange('is_blocked', value)}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Users</SelectItem>
                          <SelectItem value="true">
                            <div className="flex items-center gap-2">
                              <Ban className="w-3 h-3" />
                              Blocked Only
                            </div>
                          </SelectItem>
                          <SelectItem value="false">Active Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Activity Filters */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Activity</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Min Case Studies</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={filters.min_case_studies || ''}
                        onChange={(e) => handleNumberChange('min_case_studies', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Min Profile %</Label>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        max="100"
                        value={filters.min_profile_completion || ''}
                        onChange={(e) => handleNumberChange('min_profile_completion', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>

                {/* Date Filters */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Date Ranges</Label>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Joined After</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="h-8 text-xs justify-start">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {filters.created_after 
                                ? format(new Date(filters.created_after), 'MMM dd')
                                : 'Select'
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formatDate(filters.created_after)}
                              onSelect={(date) => handleDateChange('created_after', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Joined Before</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="h-8 text-xs justify-start">
                              <CalendarIcon className="w-3 h-3 mr-1" />
                              {filters.created_before 
                                ? format(new Date(filters.created_before), 'MMM dd')
                                : 'Select'
                              }
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={formatDate(filters.created_before)}
                              onSelect={(date) => handleDateChange('created_before', date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {totalResults} results
          </Badge>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.subscription_type?.map((type) => (
            <Badge key={`sub-${type}`} variant="secondary" className="text-xs">
              {type === 'paid' ? 'Paid' : 'Free'}
              <button
                onClick={() => handleSubscriptionTypeChange(type, false)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-2 h-2" />
              </button>
            </Badge>
          ))}
          
          {filters.career_status?.map((status) => (
            <Badge key={`career-${status}`} variant="secondary" className="text-xs">
              {status.replace('_', ' ')}
              <button
                onClick={() => handleCareerStatusChange(status, false)}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-2 h-2" />
              </button>
            </Badge>
          ))}

          {filters.is_featured === true && (
            <Badge variant="secondary" className="text-xs">
              Featured
              <button
                onClick={() => handleBooleanChange('is_featured', 'all')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-2 h-2" />
              </button>
            </Badge>
          )}

          {filters.is_blocked === true && (
            <Badge variant="secondary" className="text-xs">
              Blocked
              <button
                onClick={() => handleBooleanChange('is_blocked', 'all')}
                className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
              >
                <X className="w-2 h-2" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default UserFilters;
