import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { SecureAdminAuth } from '@/services/secureAdminAuth';
import { toast } from 'sonner';

const SecureAdminLayout = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAdmin = await SecureAdminAuth.isAdmin();
        setIsAuthorized(isAdmin);
        
        if (!isAdmin) {
          toast.error('Unauthorized access');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admin authorization:', error);
        setIsAuthorized(false);
        navigate('/admin/login');
      }
    };

    checkAuth();
  }, [navigate]);

  // Show loading state while checking auth
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Only render children if authorized
  return isAuthorized ? <Outlet /> : null;
};

export default SecureAdminLayout;
