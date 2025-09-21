
import React from 'react';
import { Linkedin, User, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AboutCard } from '@/components/ui/about-card';

const Creator = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          About the Creator
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
          Meet the mind behind Stare and learn about our mission
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <AboutCard 
          icon={<User className="h-5 w-5" />}
          title="Saurao Dalvi"
          className="h-full"
        >
          <div className="flex flex-col h-full">
            <div className="flex-1">
              <p className="text-sm md:text-base mb-4">
                A passionate product management enthusiast and marketer who is obsessed with Products, Tech, and Advertising.
                With years of experience in the industry, Saurao has helped numerous professionals advance their careers in product management.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                <Linkedin className="h-4 w-4" />
                Connect on LinkedIn
              </Button>
            </div>
          </div>
        </AboutCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
        <AboutCard 
          icon={<Target className="h-5 w-5" />}
          title="Vision"
          className="h-full"
        >
          <p className="text-sm md:text-base">
            Creating a supportive ecosystem for Product Managers in India to learn, connect, and grow professionally.
          </p>
        </AboutCard>
        
        <AboutCard 
          icon={<Award className="h-5 w-5" />}
          title="Mission"
          className="h-full"
        >
          <p className="text-sm md:text-base">
            To provide high-quality resources and opportunities specifically tailored for the Indian product management landscape.
          </p>
        </AboutCard>
      </div>
    </div>
  );
};

export default Creator;
