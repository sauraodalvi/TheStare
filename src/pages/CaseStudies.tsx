
import React from 'react';
import { SEO } from '@/components/SEO';
import { generateBreadcrumbSchema } from '@/lib/seoUtils';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CaseStudiesList from '@/components/CaseStudiesList';


const CaseStudies = () => {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Case Studies', url: '/case-studies' },
  ]);

  return (
    <>
      <SEO
        title="Product Management Case Studies | Real-World PM Examples | Stare"
        description="Browse 1000+ real product management case studies from top companies. Learn from successful PM strategies, interview preparation, and product decisions."
        keywords="PM case studies, product management examples, PM interview cases, product strategy case studies"
        url="/case-studies"
        schema={breadcrumbSchema}
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <CaseStudiesList />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default CaseStudies;
