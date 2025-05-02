
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Linkedin } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="section-padding bg-white">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 -left-6 -right-6 -top-6 -bottom-6 bg-stare-navy/5 rounded-full blur-3xl"></div>
            <Card className="border-none shadow-lg overflow-hidden relative z-10">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="rounded-full overflow-hidden h-40 w-40 mb-6 border-4 border-white shadow-md">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop" 
                    alt="Saurao Dalvi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-bold mb-1 text-stare-navy">Saurao Dalvi</h3>
                <p className="text-stare-teal font-medium mb-3">Founder, TheStare.in</p>
                <p className="text-slate-600 mb-6">
                  A seasoned product manager with global experience in launching and scaling products.
                </p>
                <Button variant="outline" size="sm" className="gap-2">
                  <Linkedin className="h-4 w-4" />
                  Connect on LinkedIn
                </Button>
              </div>
            </Card>
          </div>
          
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
            <Button className="bg-stare-navy hover:bg-stare-navy/90">Join Our Community</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
