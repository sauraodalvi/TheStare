
import React from 'react';
import { SEO } from '@/components/SEO';
import { generateWebsiteSchema, generateWebsiteSearchSchema } from '@/lib/seoUtils';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SocialProofStats from '@/components/SocialProofStats';
import Features from '@/components/Features';
import Resources from '@/components/Resources';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';

const Index = () => {
  const websiteSchema = generateWebsiteSchema();
  const searchSchema = generateWebsiteSearchSchema();

  return (
    <>
      <SEO
        title="Stare - Product Management Case Studies & Resources | Learn PM Skills"
        description="Master product management with 1000+ real-world case studies, expert resumes, portfolios, and courses. Join 50,000+ aspiring PMs learning from top companies like Google, Meta, and Amazon."
        keywords="product management, PM case studies, product manager resources, PM interview prep, product strategy, PM portfolio examples, product manager courses, PM resume templates"
        url="/"
        schema={[websiteSchema, searchSchema]}
      />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <div className="space-y-12 md:space-y-16">
            <Hero />
            <SocialProofStats />
            <Features />
            <Resources />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
