import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BarChart2, Settings, FileText, UserPlus, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Define the Profile type based on your profiles table
interface Profile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
  role?: string;
  subscription_type?: string;
  subscription_status?: string;
  last_sign_in_at?: string;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [analytics, setAnalytics] = useState({
    userCount: 0,
    activeSessions: 0,
    newSignups: 0,
  });

  // Fetch data on mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setIsLoading(true);
        
        // Get profiles from the profiles table
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (profiles) {
          setProfiles(profiles);
          
          // Calculate analytics
          const userCount = profiles.length;
          const newSignups = profiles.filter(profile => 
            new Date(profile.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
          ).length;
          
          setAnalytics({
            userCount,
            activeSessions: 0, // Session tracking would be implemented separately
            newSignups,
          });
        }
      } catch (error) {
        console.error('Error fetching profiles:', error);
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to log out');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-16 h-16 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage application users and their permissions</CardDescription>
                  </div>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3">Name</th>
                        <th className="text-left p-3">Email</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Created</th>
                        <th className="text-left p-3">Last Sign In</th>
                        <th className="text-left p-3">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.length > 0 ? (
                        profiles.map((profile) => (
                          <tr key={profile.id} className="border-t hover:bg-muted/10">
                            <td className="p-3">
                              <div className="font-medium">{profile.full_name || 'No name'}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-mono text-sm">{profile.email || 'No email'}</div>
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="p-3">
                              <div>{new Date(profile.created_at).toLocaleDateString()}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(profile.created_at).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="p-3">
                              {profile.last_sign_in_at ? (
                                <>
                                  <div>{new Date(profile.last_sign_in_at).toLocaleDateString()}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(profile.last_sign_in_at).toLocaleTimeString()}
                                  </div>
                                </>
                              ) : 'Never'}
                            </td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {profile.role || 'user'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>View application metrics and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-4xl">{analytics.userCount.toLocaleString()}</CardTitle>
                      <CardDescription>Total Users</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-4xl">
                        {analytics.activeSessions > 0 ? `${analytics.activeSessions} active` : 'N/A'}
                      </CardTitle>
                      <CardDescription>Active Sessions</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-4xl">{analytics.newSignups}</CardTitle>
                      <CardDescription>New Signups (24h)</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                <div className="h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Analytics chart will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Manage application content and media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Pages</h3>
                    <p className="text-muted-foreground">Manage static pages content</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Media Library</h3>
                    <p className="text-muted-foreground">Upload and manage media files</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
                <CardDescription>Configure application settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">General</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Maintenance Mode</p>
                          <p className="text-sm text-muted-foreground">Put the application in maintenance mode</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Enable system email notifications</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
