import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SelfStudyHero from '@/components/SelfStudyHero';
import SelfStudyContent from '@/components/SelfStudyContent';
import { Toaster } from 'sonner';

const SelfStudy = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-center" />
      <main className="flex-1">
        <SelfStudyHero />
        <SelfStudyContent />
      </main>
      <Footer />
    </div>
  );
};

export default SelfStudy;