
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseStudiesList from '@/components/CaseStudiesList';


const CaseStudies = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <CaseStudiesList />
      </main>
      <Footer />
    </div>
  );
};

export default CaseStudies;
