
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const AboutHero = () => {
  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-stare-navy mb-6">About Us</h1>
          <p className="text-lg md:text-xl text-slate-600 mb-8">
            Stare is a comprehensive platform designed specifically for aspiring product managers and product managers who want to enhance their skills and knowledge in the field. It offers an extensive collection of case studies, resumes, portfolios, and various other resources to help users gain insights and excel in their careers.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-stare-navy hover:bg-stare-navy/90">
              Explore Resources <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
