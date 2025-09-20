import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { AdminAuthService } from '@/services/adminAuthService';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboardHeader from '@/components/AdminDashboardHeader';
import AdminMigrationRunner from '@/components/AdminMigrationRunner';
import UserManagementDashboard from '@/components/admin/UserManagementDashboard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check admin authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = AdminAuthService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuth();
  }, []);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Checking authentication...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AdminLogin onAuthenticated={handleAuthenticated} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <AdminDashboardHeader
              title="Admin Dashboard"
              subtitle="Manage users and system settings"
              onLogout={handleLogout}
            />

            {/* Migration Runner - Remove after migration is complete */}
            <div className="mb-8">
              <AdminMigrationRunner />
            </div>

            {/* User Management Dashboard */}
            <UserManagementDashboard />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Admin;