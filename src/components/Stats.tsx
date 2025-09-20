
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Briefcase, FileText, FileSpreadsheet } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';

const Stats = () => {
  const stats = [
    {
      number: 800,
      suffix: '+',
      title: 'Case Studies',
      description: 'Discover valuable lessons from real product case studies. Uncover the secrets to success in product development',
      icon: Book
    },
    {
      number: 650,
      suffix: '+',
      title: 'Jobs',
      description: 'Explore exciting product job opportunities. Apply for your dream role today!',
      icon: Briefcase
    },
    {
      number: 60,
      suffix: '+',
      title: 'Resources',
      description: 'Find books, websites, communities, resumes, portfolios, etc to kickstart your product management journey',
      icon: FileText
    },
    {
      number: 40,
      suffix: '+',
      title: 'Articles',
      description: 'Browse product-related articles to ace your interviews and discover intriguing insights into product management',
      icon: FileSpreadsheet
    }
  ];

  const AnimatedStatCard = ({ stat, index }: { stat: typeof stats[0], index: number }) => {
    const { count, elementRef } = useCountUp({
      end: stat.number,
      duration: 2000 + (index * 200) // Stagger animations
    });

    return (
      <Card className="bg-card hover:shadow-lg transition-all duration-300 cursor-pointer border border-border overflow-hidden h-full flex flex-col group">
        <CardContent className="p-4 sm:p-5 flex flex-col h-full">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 p-3 rounded-full bg-stare-teal/10">
              <stat.icon className="h-6 w-6 text-stare-teal" />
            </div>
            <h3
              ref={elementRef}
              className="text-3xl font-bold text-stare-navy mb-2"
            >
              {count}{stat.suffix}
            </h3>
            <h4 className="text-lg font-medium text-stare-teal mb-2">{stat.title}</h4>
            <p className="text-muted-foreground text-sm">{stat.description}</p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <AnimatedStatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
