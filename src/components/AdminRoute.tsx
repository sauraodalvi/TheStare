import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthService } from '@/services/adminAuthService.new';
import { Loader2 } from 'lucide-react';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isAdmin = await AdminAuthService.isAdmin();
        setIsAuthorized(isAdmin);
        if (!isAdmin) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };

    checkAdmin();
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Verifying admin access...</span>
        </div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
