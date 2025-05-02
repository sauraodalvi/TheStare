
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResourcesHero from '@/components/ResourcesHero';
import ResourcesList from '@/components/ResourcesList';
import { Toaster } from 'sonner';

const Resources = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-center" />
      <main className="flex-1">
        <ResourcesHero />
        <ResourcesList />
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
