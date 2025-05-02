
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AboutHero from '@/components/AboutHero';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import Creator from '@/components/Creator';
import Support from '@/components/Support';
import CreditsSection from '@/components/CreditsSection';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AboutHero />
        <Stats />
        <Testimonials />
        <Creator />
        <Support />
        <CreditsSection />
      </main>
      <Footer />
    </div>
  );
};

export default About;
