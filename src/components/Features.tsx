
import React from 'react';
import { BookOpen, Briefcase, Users, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Features = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Curated Resources",
      description: "Access case studies, resumes, and portfolios designed to enhance your PM skills and showcase your work effectively."
    },
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Job Opportunities",
      description: "Explore product management job listings and set up personalized job alerts through the Stare Jobs portal."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Referral Network",
      description: "Get and give referrals within our community, connecting qualified candidates with the right opportunities."
    },
    {
      icon: <User className="h-8 w-8" />,
      title: "Talent Pool",
      description: "Employers can tap into our curated talent pool to find candidates that align with their hiring needs."
    }
  ];

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="space-y-12 md:space-y-16">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 md:mb-8">
              Everything You Need to Get Hired
            </h2>
            <p className="text-muted-foreground mb-4">
              TheStare.in offers a comprehensive suite of resources tailored to the needs of the product management community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group"
              >
                <CardContent className="p-4 sm:p-5 flex flex-col h-full">
                  <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-stare-teal/10 text-stare-teal mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-stare-navy">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm flex-1">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link to="/pricing">
              <Button
                size="lg"
                className="bg-stare-teal hover:bg-stare-teal/90"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
