import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, HeartHandshake } from 'lucide-react';
import { AboutCard } from '@/components/ui/about-card';

const Support = () => {
  const handleSupportUs = () => {
    window.open('https://saurao.gumroad.com/l/BuymeaCoffee', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          Support Our Mission
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          Help us continue providing valuable resources to the product management community
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 sm:gap-6">
        <AboutCard 
          icon={<HeartHandshake className="h-5 w-5" />}
          title="Support Our Work"
          className="h-full"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <p className="text-sm md:text-base mb-4">
                Your financial support helps us maintain and improve our platform, create new resources, 
                and keep our community thriving. Every contribution makes a difference in helping us 
                reach more aspiring product managers.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Button 
                size="lg"
                className="gap-2 w-full sm:w-auto"
                onClick={handleSupportUs}
              >
                <Heart className="h-4 w-4" />
                Make a Donation
              </Button>
            </div>
          </div>
        </AboutCard>
      </div>
    </div>
  );
};

export default Support;
