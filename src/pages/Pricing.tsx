
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';
import CreditsSection from '@/components/CreditsSection';

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <PricingSection />
        <CreditsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
