
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Resources from '@/components/Resources';
import JobBoard from '@/components/JobBoard';
import Referrals from '@/components/Referrals';
import About from '@/components/About';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Resources />
        <JobBoard />
        <Referrals />
        <About />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
