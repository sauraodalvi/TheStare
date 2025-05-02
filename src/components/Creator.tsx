
import React from 'react';
import { Card } from '@/components/ui/card';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Creator = () => {
  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-stare-navy mb-8 text-center font-display">
            About the Creator
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Card className="border-none shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="rounded-full overflow-hidden h-40 w-40 mb-6 border-4 border-white shadow-md">
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop" 
                        alt="Saurao Dalvi" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-stare-navy">Saurao Dalvi</h3>
                    <p className="text-stare-teal font-medium mb-3">Founder, TheStare.in</p>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Linkedin className="h-4 w-4" />
                      Connect on LinkedIn
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4 text-stare-navy">Saurao Dalvi!</h3>
              <p className="text-lg text-slate-600 mb-6">
                A passionate product management enthusiast and marketer who is obsessed with Products, Tech, and Advertising
              </p>
              <div className="space-y-4 mb-6">
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-stare-navy mb-2">Vision</h4>
                  <p className="text-slate-600">
                    Creating a supportive ecosystem for Product Managers in India to learn, connect, and grow professionally.
                  </p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-stare-navy mb-2">Mission</h4>
                  <p className="text-slate-600">
                    To provide high-quality resources and opportunities specifically tailored for the Indian product management landscape.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Creator;
