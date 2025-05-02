
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignInForm from '@/components/SignInForm';

const SignIn = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <SignInForm />
      </main>
      <Footer />
    </div>
  );
};

export default SignIn;
