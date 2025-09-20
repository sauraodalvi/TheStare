import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, Clock, Shield, RefreshCw } from 'lucide-react';
import { AdminAuthService } from '@/services/adminAuthService';
import { toast } from 'sonner';

interface AdminDashboardHeaderProps {
  title: string;
  subtitle: string;
  onLogout: () => void;
}

const AdminDashboardHeader = ({ title, subtitle, onLogout }: AdminDashboardHeaderProps) => {
  const [sessionInfo, setSessionInfo] = useState(AdminAuthService.getSessionInfo());

  useEffect(() => {
    const interval = setInterval(() => {
      const info = AdminAuthService.getSessionInfo();
      setSessionInfo(info);
      
      // Auto-logout if session expired
      if (!info.authenticated) {
        onLogout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [onLogout]);

  const handleLogout = () => {
    AdminAuthService.logout();
    toast.success('Logged out successfully');
    onLogout();
  };

  const handleExtendSession = () => {
    const extended = AdminAuthService.extendSession();
    if (extended) {
      setSessionInfo(AdminAuthService.getSessionInfo());
      toast.success('Session extended by 8 hours');
    } else {
      toast.error('Failed to extend session');
    }
  };

  const formatTimeRemaining = (milliseconds?: number): string => {
    if (!milliseconds) return 'Expired';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left side - Title and subtitle */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Admin
            </Badge>
          </div>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>

        {/* Right side - Session info and actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Session info */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Session: {formatTimeRemaining(sessionInfo.timeRemaining)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExtendSession}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Extend
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-destructive hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHeader;
