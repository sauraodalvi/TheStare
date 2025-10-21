
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, MapPin, ArrowRight } from 'lucide-react';
import { OptimizedImage } from '@/components/OptimizedImage';

const JobBoard = () => {
  const jobs = [
    {
      title: "Senior Product Manager",
      company: "TechCorp India",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "5-7 years",
      salary: "₹25-35 LPA",
      logo: "https://images.unsplash.com/placeholder.svg?w=40&h=40"
    },
    {
      title: "Product Manager - Fintech",
      company: "FinSolve",
      location: "Remote (India)",
      type: "Full-time",
      experience: "3-5 years",
      salary: "₹18-25 LPA",
      logo: "https://images.unsplash.com/placeholder.svg?w=40&h=40"
    },
    {
      title: "Associate Product Manager",
      company: "GrowthLabs",
      location: "Pune, India",
      type: "Full-time",
      experience: "1-3 years",
      salary: "₹12-18 LPA",
      logo: "https://images.unsplash.com/placeholder.svg?w=40&h=40"
    }
  ];

  return (
    <section id="jobs" className="section-padding bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-stare-navy">
              Exclusive PM Opportunities
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl">
              Discover product management roles at top companies and startups across India. Set up personalized job alerts to never miss an opportunity.
            </p>
          </div>
          <Button variant="outline" className="shrink-0 border-stare-teal text-stare-teal hover:bg-stare-teal/10">
            View All Jobs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-6">
          {jobs.map((job, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-center gap-6 p-6">
                  <div className="flex-shrink-0">
                    <div className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center">
                      <OptimizedImage src={job.logo} alt={job.company} className="h-10 w-10" width={40} height={40} />
                    </div>
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-stare-navy">{job.title}</h3>
                    <p className="text-stare-gray">{job.company}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="inline-flex items-center text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {job.type}
                      </span>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        {job.experience}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-3">
                    <span className="font-medium text-stare-teal">{job.salary}</span>
                    <Button size="sm">Apply Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 bg-muted/50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-semibold mb-2 text-stare-navy">Find your next product role</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Create a job alert and get notified when new positions matching your criteria are posted.
          </p>
          <Button className="bg-stare-navy hover:bg-stare-navy/90">Create Job Alert</Button>
        </div>
      </div>
    </section>
  );
};

export default JobBoard;
