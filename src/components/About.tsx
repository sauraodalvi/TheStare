import React from 'react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-stare-navy">
              Our Mission
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              TheStare.in was founded in 2022 with a vision to create a supportive ecosystem for Product Managers in India to learn, connect, and grow professionally.
            </p>
            <div className="space-y-4 mb-8">
              <div className="bg-slate-50 p-5 rounded-lg">
                <h3 className="font-semibold text-stare-navy mb-2">Community-First Approach</h3>
                <p className="text-slate-600">We believe in the power of community to create opportunities and foster growth for all product managers.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-lg">
                <h3 className="font-semibold text-stare-navy mb-2">Quality Resources</h3>
                <p className="text-slate-600">We curate high-quality content and opportunities specifically for the Indian product management landscape.</p>
              </div>
              <div className="bg-slate-50 p-5 rounded-lg">
                <h3 className="font-semibold text-stare-navy mb-2">Career Advancement</h3>
                <p className="text-slate-600">Our platform is designed to help PMs at every stage of their career journey through knowledge sharing and networking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;