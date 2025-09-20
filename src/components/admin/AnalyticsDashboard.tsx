import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Crown, 
  TrendingUp, 
  Calendar,
  FileText,
  Star,
  Ban,
  Download,
  BarChart3,
  PieChart,
  Activity,
  DollarSign
} from 'lucide-react';
import { UserAnalytics } from '@/types/profile';

interface AnalyticsDashboardProps {
  analytics: UserAnalytics;
  isLoading?: boolean;
}

const AnalyticsDashboard = ({ analytics, isLoading }: AnalyticsDashboardProps) => {
  const handleExportData = () => {
    // Create CSV data
    const csvData = [
      ['Metric', 'Value'],
      ['Total Users', String(analytics.total_users ?? 0)],
      ['Free Users', String(analytics.free_users ?? 0)],
      ['Paid Users', String(analytics.paid_users ?? 0)],
      ['Featured Users', String(analytics.featured_users ?? 0)],
      ['Blocked Users', String(analytics.blocked_users ?? 0)],
      ['Job Seekers', String(analytics.career_status_breakdown.job_seeker ?? 0)],
      ['Hiring', String(analytics.career_status_breakdown.hiring ?? 0)],
      ['Employed', String(analytics.career_status_breakdown.employed ?? 0)],
      ['Not Specified', String(analytics.career_status_breakdown.not_specified ?? 0)],
      ['Total Case Studies', String(analytics.total_case_studies_uploaded ?? 0)],
      ['Average Profile Completion', `${analytics.avg_profile_completion ?? 0}%`],
      ['New Users (30d)', String(analytics.new_users_30d ?? 0)],
      ['Active Users (30d)', String(analytics.active_users_30d ?? 0)],
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getSubscriptionRate = () => {
    if (analytics.total_users === 0) return 0;
    return Math.round((analytics.paid_users / analytics.total_users) * 100);
  };

  const getCareerDistribution = () => [
    { label: 'Job Seekers', value: analytics.career_status_breakdown.job_seeker, color: 'bg-blue-500' },
    { label: 'Hiring', value: analytics.career_status_breakdown.hiring, color: 'bg-green-500' },
    { label: 'Employed', value: analytics.career_status_breakdown.employed, color: 'bg-purple-500' },
    { label: 'Not Specified', value: analytics.career_status_breakdown.not_specified, color: 'bg-gray-400' },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <div className="animate-pulse bg-muted h-10 w-32 rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Button onClick={handleExportData} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold">{Number(analytics.total_users ?? 0).toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Paid Users</p>
                <p className="text-3xl font-bold">{Number(analytics.paid_users ?? 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">
                  {getSubscriptionRate()}% conversion rate
                </p>
              </div>
              <Crown className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New (30d)</p>
                <p className="text-3xl font-bold">{Number(analytics.new_users_30d ?? 0).toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active (30d)</p>
                <p className="text-3xl font-bold">{Number(analytics.active_users_30d ?? 0).toLocaleString()}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Subscription Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Free Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{Number(analytics.free_users ?? 0).toLocaleString()}</span>
                  <Badge variant="secondary">
                    {analytics.total_users > 0 ? Math.round((analytics.free_users / analytics.total_users) * 100) : 0}%
                  </Badge>
                </div>
              </div>
              <Progress value={analytics.total_users > 0 ? (analytics.free_users / analytics.total_users) * 100 : 0} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-primary" />
                  <span className="text-sm">Paid Users</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{Number(analytics.paid_users ?? 0).toLocaleString()}</span>
                  <Badge variant="default">
                    {getSubscriptionRate()}%
                  </Badge>
                </div>
              </div>
              <Progress value={getSubscriptionRate()} className="h-2" />
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Featured Users</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500" />
                  <span className="font-medium">{analytics.featured_users}</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Blocked Users</span>
                <div className="flex items-center gap-1">
                  <Ban className="w-3 h-3 text-red-500" />
                  <span className="font-medium">{analytics.blocked_users}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Career Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getCareerDistribution().map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.value} ({analytics.total_users > 0 ? Math.round((item.value / analytics.total_users) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{
                        width: `${analytics.total_users > 0 ? (item.value / analytics.total_users) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content & Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Content Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{Number(analytics.total_case_studies_uploaded ?? 0).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Case Studies</div>
              </div>
              
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">
                  {analytics.total_users > 0 ? (analytics.total_case_studies_uploaded / analytics.total_users).toFixed(1) : '0'}
                </div>
                <div className="text-sm text-muted-foreground">Avg per User</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">{analytics.avg_profile_completion}%</div>
                <div className="text-sm text-muted-foreground">Average Completion</div>
              </div>

              <Progress value={analytics.avg_profile_completion} className="h-3" />
              
              <div className="text-xs text-muted-foreground text-center">
                Higher completion rates indicate better user engagement
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Growth Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-green-800">New Users</div>
                  <div className="text-xs text-green-600">Last 30 days</div>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {analytics.new_users_30d}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-blue-800">Active Users</div>
                  <div className="text-xs text-blue-600">Last 30 days</div>
                </div>
                <div className="text-2xl font-bold text-blue-700">
                  {analytics.active_users_30d}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
