
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SocialProofStats from '@/components/SocialProofStats';
import Features from '@/components/Features';
import Resources from '@/components/Resources';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="space-y-12 md:space-y-16">
          <Hero />
          <SocialProofStats />
          <Features />
          <Resources />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
