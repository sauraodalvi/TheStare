
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Resources = () => {
  const resources = [
    {
      category: "Case Study",
      title: "Product Strategy for Marketplace Apps",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&auto=format&fit=crop",
      popularity: "Popular",
      link: "/case-studies"
    },
    {
      category: "Resume Template",
      title: "Senior PM Resume with 5+ Experience",
      image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=500&auto=format&fit=crop",
      popularity: "New",
      link: "#"
    },
    {
      category: "Portfolio",
      title: "UX-Focused Product Manager Portfolio",
      image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=500&auto=format&fit=crop",
      popularity: "Featured",
      link: "#"
    }
  ];

  return (
    <section id="resources" className="section-padding bg-slate-50">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-stare-navy">
              Expert-Curated Resources
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Learn from comprehensive case studies, professional resume templates, and impressive portfolio examples tailored for product managers.
            </p>
          </div>
          <Button 
            variant="outline" 
            className="shrink-0 border-stare-teal text-stare-teal hover:bg-stare-teal/10"
            as={Link}
            to="/case-studies"
          >
            View Case Studies <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, index) => (
            <Card key={index} className="overflow-hidden border-none shadow-md card-hover">
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={resource.image} 
                  alt={resource.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <span className="absolute top-4 right-4 bg-white/90 text-stare-navy text-xs font-semibold px-3 py-1 rounded-full">
                  {resource.popularity}
                </span>
              </div>
              <CardContent className="pt-6">
                <div className="text-sm font-medium text-stare-teal mb-2">{resource.category}</div>
                <h3 className="text-xl font-semibold mb-4 text-stare-navy hover:text-stare-teal transition-colors">
                  <Link to={resource.link}>{resource.title}</Link>
                </h3>
                <div className="flex justify-between items-center">
                  <Button variant="link" className="px-0 text-stare-teal" as={Link} to={resource.link}>
                    Read More
                  </Button>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500">124 saves</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Resources;
