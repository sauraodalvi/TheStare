
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Book, Briefcase, FileText, FileSpreadsheet } from 'lucide-react';

const Stats = () => {
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
    <section className="py-16 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-slate-50">
                    <stat.icon className="h-6 w-6 text-stare-teal" />
                  </div>
                  <h3 className="text-3xl font-bold text-stare-navy mb-2">{stat.number}</h3>
                  <h4 className="text-lg font-medium text-stare-teal mb-2">{stat.title}</h4>
                  <p className="text-slate-600">{stat.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
