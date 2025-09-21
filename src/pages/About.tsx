
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHero from '@/components/AboutHero';
import Stats from '@/components/Stats';
import CompanyLogos from '@/components/CompanyLogos';
import Testimonials from '@/components/Testimonials';
import Creator from '@/components/Creator';
import Support from '@/components/Support';
import CreditsSection from '@/components/CreditsSection';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        <AboutHero />
        <div className="space-y-12 md:space-y-16 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <Stats />
          </div>
          
          <div className="w-full">
            <CompanyLogos />
          </div>
          
          <div className="max-w-7xl mx-auto w-full space-y-12">
            <Creator />
            <Support />
          </div>
          
          <div className="w-full">
            <Testimonials />
          </div>
          
          <div className="max-w-7xl mx-auto w-full">
            <CreditsSection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
