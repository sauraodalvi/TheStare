
import React from 'react';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignUpForm from '@/components/SignUpForm';

const SignUp = () => {
  return (
    <>
      <SEO
        title="Sign Up - Stare"
        description="Create your account to access product management resources, case studies, and premium features."
        url="/signup"
        noindex={true}
        nofollow={true}
      />
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
    </>
  );
};

export default SignUp;
