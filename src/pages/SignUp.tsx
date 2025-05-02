
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignUpForm from '@/components/SignUpForm';

const SignUp = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-slate-50">
        <SignUpForm />
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
