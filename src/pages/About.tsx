
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <div className="space-y-12 md:space-y-16">
          <AboutHero />
          <Stats />
          <CompanyLogos />
          <Testimonials />
          <Creator />
          <Support />
          <CreditsSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
