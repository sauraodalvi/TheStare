
import React from 'react';
import { BookOpen, Briefcase, Users, User } from 'lucide-react';

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
    <section className="section-padding bg-muted/50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-stare-navy">
            Empower Your Product Journey
          </h2>
          <p className="text-lg text-muted-foreground">
            TheStare.in offers a comprehensive suite of resources tailored to the needs of the product management community.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-muted rounded-xl p-6 card-hover"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-stare-teal/10 text-stare-teal mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-stare-navy">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
