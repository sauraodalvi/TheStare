import React from 'react';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SelfStudyHero from '@/components/SelfStudyHero';
import SelfStudyContent from '@/components/SelfStudyContent';

const SelfStudy = () => {
  return (
    <>
      <SEO
        title="Self-Study Resources for Product Managers | Stare"
        description="Access comprehensive self-study resources for product managers. Books, articles, guides, and learning materials to advance your PM career."
        keywords="PM self-study, product management learning resources, PM books, product manager guides"
        url="/self-study"
      />
      <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <SelfStudyHero />
        <SelfStudyContent />
      </main>
      <Footer />
    </div>
    </>
  );
};

export default SelfStudy;