
import React from 'react';
import { SEO } from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ResourcesHero from '@/components/ResourcesHero';
import ResourcesList from '@/components/ResourcesList';
import { Toaster } from 'sonner';

const Resources = () => {
  return (
    <>
      <SEO
        title="Product Management Resources - Books, Courses & Tools | Stare"
        description="Comprehensive collection of PM resources including books, courses, tools, and templates to accelerate your product management career."
        keywords="PM resources, product management books, PM courses, product manager tools, PM templates"
        url="/resources"
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Toaster position="top-center" />
        <main className="flex-1">
          <ResourcesHero />
          <ResourcesList />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Resources;
