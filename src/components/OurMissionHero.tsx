import React from 'react';

const OurMissionHero = () => {
  return (
    <section className="relative overflow-hidden bg-muted/50 pb-16 pt-10 md:pt-16 lg:pt-20">
      <div className="container">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-stare-navy mb-6">
              Our <span className="text-stare-teal">Mission</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-4xl mx-auto">
              To empower product managers across India with the knowledge, resources, and community they need to excel in their careers and drive meaningful innovation in the digital landscape.
            </p>
            <p className="text-lg text-muted-foreground mb-12 max-w-4xl mx-auto">
              TheStare.in was founded in 2022 with a vision to create a supportive ecosystem for Product Managers in India to learn, connect, and grow professionally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
              <h3 className="font-semibold text-foreground text-xl mb-3">Community-First Approach</h3>
              <p className="text-muted-foreground">We believe in the power of community to create opportunities and foster growth for all product managers.</p>
            </div>
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border">
              <h3 className="font-semibold text-foreground text-xl mb-3">Quality Resources</h3>
              <p className="text-muted-foreground">We curate high-quality content and opportunities specifically for the Indian product management landscape.</p>
            </div>
            <div className="bg-background p-6 rounded-xl shadow-sm border border-border lg:col-span-1 md:col-span-2 lg:col-start-auto md:mx-auto md:max-w-md lg:max-w-none">
              <h3 className="font-semibold text-foreground text-xl mb-3">Career Advancement</h3>
              <p className="text-muted-foreground">Our platform is designed to help PMs at every stage of their career journey through knowledge sharing and networking.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-muted/50 to-transparent z-0"></div>
      <div className="absolute hidden md:block top-40 right-4 w-72 h-72 bg-stare-navy/5 rounded-full blur-3xl"></div>
      <div className="absolute hidden md:block bottom-10 left-10 w-60 h-60 bg-stare-teal/5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default OurMissionHero;
