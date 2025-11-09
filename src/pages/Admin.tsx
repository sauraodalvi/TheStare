import React, { useState, useEffect } from 'react';
import { Loader2, Users, FileText, BarChart2, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthService } from '@/services/adminAuthService.new';
import { AdminDashboardHeader } from '@/components/AdminDashboardHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const [userEmail, setUserEmail] = useState('');

  // Check admin status on component mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const isAdmin = await AdminAuthService.isAdmin();
        if (!isAdmin) {
          toast.error('You do not have permission to access this page');
          navigate('/');
          return;
        }
        
        // Get user email from session
        const session = AdminAuthService.getSessionInfo();
        if (session.userId) {
          // In a real app, you might want to fetch the full user profile here
          setUserEmail(session.userId);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast.error('Failed to verify admin status');
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const handleLogout = () => {
    AdminAuthService.logout();
    toast.success('Successfully logged out');
    navigate('/');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminDashboardHeader 
        onLogout={handleLogout}
        title="Admin Dashboard"
        subtitle={userEmail ? `Logged in as ${userEmail}` : 'Loading...'}
      />
      
      <main className="flex-1 container py-8 px-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="space-y-6"
          defaultValue="users"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid w-full sm:w-auto grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>Content</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>
            
            {activeTab === 'users' && (
              <Button size="sm" onClick={() => {/* Add new user */}}>
                Add User
              </Button>
            )}
          </div>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage application users and permissions here.</p>
                {/* User management table will go here */}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Manage your application content here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,234</div>
                      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                  </Card>
                  {/* Add more stat cards */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Account</h3>
                  <div className="space-y-2">
                    <p><strong>Email:</strong> {userEmail || 'Loading...'}</p>
                    <p><strong>Role:</strong> Administrator</p>
                    <p><strong>Last Login:</strong> {new Date().toLocaleString()}</p>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">System Status</h3>
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    All systems operational
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Clear Cache</h4>
                        <p className="text-sm text-gray-500">Clear all cached data</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Clear Cache
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                      <div>
                        <h4 className="font-medium text-red-700">Sign out</h4>
                        <p className="text-sm text-red-600">End your current session</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={handleLogout}
                      >
                        Sign out
                      </Button>
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

export default Admin;