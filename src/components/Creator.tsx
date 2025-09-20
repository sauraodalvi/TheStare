
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Creator = () => {
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              About the Creator
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card hover:shadow-lg transition-all duration-300 border border-border overflow-hidden">
              <CardContent className="p-4 sm:p-5">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6 text-foreground">Saurao Dalvi!</h3>
                  <div className="space-y-6 text-left max-w-3xl mx-auto">
                    <p className="text-muted-foreground">
                      A passionate product management enthusiast and marketer who is obsessed with Products, Tech, and Advertising
                    </p>

                    <div className="bg-card p-6 rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-3 text-lg">Vision</h4>
                      <p className="text-muted-foreground">
                        Creating a supportive ecosystem for Product Managers in India to learn, connect, and grow professionally.
                      </p>
                    </div>

                    <div className="bg-card p-6 rounded-lg border border-border">
                      <h4 className="font-semibold text-foreground mb-3 text-lg">Mission</h4>
                      <p className="text-muted-foreground">
                        To provide high-quality resources and opportunities specifically tailored for the Indian product management landscape.
                      </p>
                    </div>

                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Linkedin className="h-4 w-4" />
                        Connect on LinkedIn
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Creator;
