import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LogOut, Clock, RefreshCw } from 'lucide-react';
import { AdminAuthService } from '@/services/adminAuthService.new';
import { toast } from 'sonner';

interface AdminDashboardHeaderProps {
  onLogout?: () => void;
  title?: string;
  subtitle?: string;
}

export function AdminDashboardHeader({
  onLogout,
  title = 'Admin Dashboard',
  subtitle = 'Manage your application'
}: AdminDashboardHeaderProps) {
  const [sessionInfo, setSessionInfo] = useState<{ 
    authenticated: boolean; 
    timeRemaining?: number; 
    userId?: string 
  }>({ 
    authenticated: false, 
    timeRemaining: 0 
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const info = await AdminAuthService.getSessionInfo();
        setSessionInfo(info);
        
        // Auto-logout if session expired
        if (!info.authenticated) {
          onLogout();
        }
      } catch (error) {
        console.error('Error checking session:', error);
        onLogout();
      }
    };

    // Check immediately and then every minute
    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [onLogout]);

  const handleLogout = () => {
    AdminAuthService.logout();
    toast.success('Logged out successfully');
    onLogout();
  };

  const formatTimeRemaining = (milliseconds: number | undefined): string => {
    if (!milliseconds || milliseconds <= 0) return 'Expired';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Session: {formatTimeRemaining(sessionInfo.timeRemaining)}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminDashboardHeader;
