
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignInForm from '@/components/SignInForm';

const SignIn = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <SignInForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
