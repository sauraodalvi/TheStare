
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignUpForm from '@/components/SignUpForm';

const SignUp = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="py-8 px-4">
          <div className="container mx-auto max-w-7xl">
            <SignUpForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;
