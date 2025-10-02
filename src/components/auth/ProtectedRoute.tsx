import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireSubscription?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  requireSubscription = false 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login with the current path to return to after login
      navigate(`/sign-in?redirect=${encodeURIComponent(location.pathname)}`, { replace: true });
    } else if (!loading && user && requireSubscription && user.subscriptionType !== 'paid') {
      // Redirect to pricing page if subscription is required but user doesn't have it
      navigate('/pricing', { replace: true });
    }
  }, [user, loading, navigate, location.pathname, requireSubscription]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  if (requireSubscription && user.subscriptionType !== 'paid') {
    return null; // Will be redirected by the useEffect
  }

  return <>{children}</>;
}
