
import React from 'react';

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-slate-50 pb-16 pt-10 md:pt-16 lg:pt-20">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col space-y-6 max-w-lg">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-stare-navy">
                Accelerate Your <span className="text-stare-teal">Product Management</span> Career
              </h1>
              <p className="text-lg text-slate-600 mt-4">
                Join India's premier community for aspiring and experienced product managers. Access curated resources, job opportunities, and an exclusive network.
              </p>
            </div>
            
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 -left-6 -right-6 -top-6 -bottom-6 bg-stare-teal/10 rounded-full blur-3xl"></div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" 
              alt="Product managers collaborating" 
              className="relative z-10 w-full h-auto rounded-xl shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white to-transparent z-0"></div>
      <div className="absolute hidden md:block top-40 right-4 w-72 h-72 bg-stare-teal/5 rounded-full blur-3xl"></div>
      <div className="absolute hidden md:block bottom-10 left-10 w-60 h-60 bg-stare-navy/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default Hero;
