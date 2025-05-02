
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticipateContent from '@/components/ParticipateContent';
import { Toaster } from 'sonner';

const Participate = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Toaster position="top-center" />
      <main className="flex-1">
        <ParticipateContent />
      </main>
      <Footer />
    </div>
  );
};

export default Participate;
