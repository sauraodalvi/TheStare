import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, BookOpen, Briefcase, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const FinalCTA = () => {
  const userPaths = [
    {
      icon: BookOpen,
      title: 'Aspiring PM',
      description: 'New to product management? Start with our comprehensive case studies and learning resources.',
      primaryCTA: {
        text: 'Start Learning',
        link: '/case-studies',
        variant: 'default' as const
      },
      secondaryCTA: {
        text: 'View Resources',
        link: '/resources',
        variant: 'outline' as const
      }
    },
    {
      icon: Briefcase,
      title: 'Job Seeker',
      description: 'Looking for your next PM role? Access resume templates, portfolios, and job opportunities.',
      primaryCTA: {
        text: 'Browse Jobs',
        link: '/pricing',
        variant: 'default' as const
      },
      secondaryCTA: {
        text: 'Get Resume Help',
        link: '/resume',
        variant: 'outline' as const
      }
    },
    {
      icon: Users,
      title: 'Experienced PM',
      description: 'Level up your career with advanced case studies and connect with our PM community.',
      primaryCTA: {
        text: 'Join Community',
        link: '/pricing',
        variant: 'default' as const
      },
      secondaryCTA: {
        text: 'View Portfolios',
        link: '/portfolio',
        variant: 'outline' as const
      }
    }
  ];

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Main CTA Header */}
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-stare-teal/10">
                <Star className="h-8 w-8 text-stare-teal" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Ready to Accelerate Your PM Career?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              Join 10,000+ product managers who have advanced their careers with TheStare.in. Choose your path below.
            </p>
          </div>

          {/* User Path Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {userPaths.map((path, index) => (
              <Card 
                key={index} 
                className="bg-card hover:shadow-lg transition-all duration-300 border border-border overflow-hidden h-full flex flex-col group"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-stare-navy/10">
                      <path.icon className="h-6 w-6 text-stare-navy" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">{path.title}</h3>
                    <p className="text-muted-foreground text-sm mb-6 flex-1">{path.description}</p>
                    
                    <div className="flex flex-col gap-3 w-full">
                      <Link to={path.primaryCTA.link} className="w-full">
                        <Button 
                          size="sm"
                          className="w-full bg-stare-navy hover:bg-stare-navy/90"
                        >
                          {path.primaryCTA.text} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={path.secondaryCTA.link} className="w-full">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="w-full border-stare-teal text-stare-teal hover:bg-stare-teal/10"
                        >
                          {path.secondaryCTA.text}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <Card className="bg-stare-navy/5 border-stare-navy/20 max-w-2xl mx-auto">
              <CardContent className="p-6 sm:p-8">
                <h3 className="text-xl font-bold text-stare-navy mb-3">
                  Not sure where to start?
                </h3>
                <p className="text-muted-foreground mb-6">
                  Explore our free resources and discover what works best for your PM journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/case-studies">
                    <Button 
                      size="lg"
                      className="bg-stare-navy hover:bg-stare-navy/90 w-full sm:w-auto"
                    >
                      Browse Free Case Studies
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-stare-teal text-stare-teal hover:bg-stare-teal/10 w-full sm:w-auto"
                    >
                      Learn More About Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
