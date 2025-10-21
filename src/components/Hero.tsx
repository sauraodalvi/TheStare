
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '@/components/OptimizedImage';

const Hero = () => {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 max-w-lg">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Accelerate Your <span className="text-stare-teal">Product Management</span> Career
              </h1>
              <p className="text-muted-foreground">
                Join India's premier community for aspiring and experienced product managers. Access curated resources, job opportunities, and an exclusive network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link to="/case-studies">
                  <Button size="lg" className="bg-stare-navy hover:bg-stare-navy/90 w-full sm:w-auto">
                    Browse Case Studies
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="border-stare-teal text-stare-teal hover:bg-stare-teal/10 w-full sm:w-auto">
                    Join Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 -left-6 -right-6 -top-6 -bottom-6 bg-stare-teal/10 rounded-full blur-3xl"></div>
            <OptimizedImage
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop"
              alt="Product managers collaborating"
              className="relative z-10 w-full h-auto rounded-xl shadow-lg object-cover"
              priority={true}
              width={800}
              height={533}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
