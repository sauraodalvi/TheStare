import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const AdminRouteSimple = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // In development, bypass all checks
  if (import.meta.env.DEV) {
    console.log('DEV MODE: Bypassing all admin checks');
    return <>{children}</>;
  }

  // In production, check if user is authenticated
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
