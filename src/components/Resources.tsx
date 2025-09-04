
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  return (
    <section id="resources" className="section-padding bg-slate-50">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-stare-navy">
              Huge Resource Repository
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Learn from comprehensive case studies, professional resume templates, and impressive portfolio examples tailored for product managers.
            </p>
          </div>
          <Link to="/case-studies">
            <Button 
              variant="outline" 
              className="shrink-0 border-stare-teal text-stare-teal hover:bg-stare-teal/10"
            >
              View Case Studies <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Resources;
