
import React from 'react';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';

const Pricing = () => {
  return (
    <>
      <SEO
        title="Pricing - Product Management Resources & Premium Plans | Stare"
        description="Choose the perfect plan for your PM journey. Free access to case studies, resources, and premium features to accelerate your product management career."
        keywords="PM pricing, product management subscription, PM premium features, case study access pricing"
        url="/pricing"
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <PricingSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Pricing;
