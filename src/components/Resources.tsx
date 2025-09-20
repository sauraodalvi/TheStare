
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen, FileText, Briefcase, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const resourceTypes = [
    {
      icon: BookOpen,
      title: 'Case Studies',
      count: '800+',
      description: 'Real PM case studies from top companies',
      link: '/case-studies',
      buttonText: 'View Case Studies'
    },
    {
      icon: FileText,
      title: 'Portfolios',
      count: '50+',
      description: 'Professional PM portfolio examples',
      link: '/resources/portfolio',
      buttonText: 'Browse Portfolios'
    },
    {
      icon: Briefcase,
      title: 'Resume Templates',
      count: '25+',
      description: 'Proven resume templates for PMs',
      link: '/resources/resume',
      buttonText: 'Download Templates'
    },
    {
      icon: User,
      title: 'Self-Study',
      count: '60+',
      description: 'Curated learning resources',
      link: '/resources/self-study',
      buttonText: 'Start Learning'
    }
  ];

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Comprehensive Resource Library
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              Access the largest collection of PM resources in India. Everything you need to land your dream product management role.
            </p>
          </div>

          {/* Resource Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {resourceTypes.map((resource, index) => (
              <Card
                key={index}
                className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-stare-teal/10">
                      <resource.icon className="h-6 w-6 text-stare-teal" />
                    </div>
                    <h3 className="text-2xl font-bold text-stare-navy mb-1">{resource.count}</h3>
                    <h4 className="text-lg font-semibold text-foreground mb-2">{resource.title}</h4>
                    <p className="text-muted-foreground text-sm mb-4 flex-1">{resource.description}</p>
                    <Link to={resource.link} className="w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-stare-teal text-stare-teal hover:bg-stare-teal/10"
                      >
                        {resource.buttonText}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resources;
