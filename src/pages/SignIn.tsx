
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignInForm from '@/components/SignInForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const SignIn = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!loading && user) {
      // Redirect to the intended URL or home if already logged in
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [user, loading, navigate, searchParams]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <SignInForm />
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
