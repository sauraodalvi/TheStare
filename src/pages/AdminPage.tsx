import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminDashboardHeader } from '@/components/AdminDashboardHeader';
import { AdminAuthService } from '@/services/adminAuthService.new';
import { toast } from 'sonner';

const AdminPage = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await AdminAuthService.logout();
      toast.success('Successfully logged out');
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboardHeader 
        title="Admin Dashboard" 
        subtitle="Manage your application"
        onLogout={handleLogout}
      />
      <main className="container mx-auto p-4">
        <div className="bg-card p-6 rounded-lg shadow">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Admin Panel</h2>
              <p className="text-muted-foreground">Manage your application's settings and content</p>
            </div>
            {import.meta.env.MODE === 'development' && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Development Mode
              </span>
            )}
          </div>
          
          <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">User Management</h3>
                <p className="text-sm text-muted-foreground">Manage users, roles, and permissions</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Content</h3>
                <p className="text-sm text-muted-foreground">Manage website content and media</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-muted-foreground">View usage statistics and reports</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h3 className="font-semibold mb-2">Settings</h3>
                <p className="text-sm text-muted-foreground">Configure system settings</p>
              </div>
            </div>
            
            <div className="bg-background border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">
                  Add New User
                </button>
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-accent">
                  View Reports
                </button>
                <button className="px-3 py-1.5 text-sm border rounded hover:bg-accent">
                  System Status
                </button>
              </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
