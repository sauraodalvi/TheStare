import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Briefcase, FileText, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const SocialProofStats = () => {
  const stats = [
    {
      number: '800+',
      title: 'Case Studies',
      description: 'Discover valuable lessons from real product case studies. Uncover the secrets to success in product development',
      icon: Book
    },
    {
      number: '650+',
      title: 'Jobs',
      description: 'Explore exciting product job opportunities. Apply for your dream role today!',
      icon: Briefcase
    },
    {
      number: '60+',
      title: 'Resources',
      description: 'Find books, websites, communities, resumes, portfolios, etc to kickstart your product management journey',
      icon: FileText
    },
    {
      number: '40+',
      title: 'Articles',
      description: 'Browse product-related articles to ace your interviews and discover intriguing insights into product management',
      icon: FileSpreadsheet
    }
  ];

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          {/* Section Header */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Trusted by 10,000+ Product Managers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
              Join India's largest PM community and access the resources that have helped thousands advance their careers.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-stare-teal/10">
                      <stat.icon className="h-6 w-6 text-stare-teal" />
                    </div>
                    <h3 className="text-3xl font-bold text-stare-navy mb-2">{stat.number}</h3>
                    <h4 className="text-lg font-medium text-stare-teal mb-2">{stat.title}</h4>
                    <p className="text-muted-foreground text-sm">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link to="/resources">
              <Button 
                size="lg" 
                className="bg-stare-navy hover:bg-stare-navy/90"
              >
                View All Resources <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofStats;
