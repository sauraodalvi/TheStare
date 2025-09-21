import React from 'react';
import { Heart, Users, Code, BookOpen, MessageSquare, Award } from 'lucide-react';
import { AboutCard } from '@/components/ui/about-card';

const CreditsSection = () => {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Credits & Acknowledgments
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're grateful for the amazing people and technologies that made this possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AboutCard 
              icon={<Users className="h-5 w-5" />}
              title="Community"
            >
              <p className="text-sm">
                Special thanks to our amazing community of product managers, designers, and developers who have contributed ideas, feedback, and support.
              </p>
            </AboutCard>
            
            <AboutCard 
              icon={<Code className="h-5 w-5" />}
              title="Open Source"
            >
              <p className="text-sm">
                Built with amazing open source technologies including React, TypeScript, Tailwind CSS, and Shadcn UI.
              </p>
            </AboutCard>
            
            <AboutCard 
              icon={<BookOpen className="h-5 w-5" />}
              title="Resources"
            >
              <p className="text-sm">
                Inspired by industry leaders and thought leaders in product management, design, and technology.
              </p>
            </AboutCard>
            
            <AboutCard 
              icon={<MessageSquare className="h-5 w-5" />}
              title="Feedback"
            >
              <p className="text-sm">
                We value your feedback! Help us improve by sharing your thoughts and suggestions.
              </p>
            </AboutCard>
          </div>
          
          <div className="text-center pt-8">
            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1">
              Made with <Heart className="h-4 w-4 text-red-500" /> by the Stare team
            </p>
            <p className="text-xs text-muted-foreground/70 mt-2">
              Special thanks to all our contributors and supporters
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreditsSection;
