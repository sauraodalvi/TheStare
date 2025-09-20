import React from 'react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <section id="about" className="section-padding bg-muted/50">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-foreground">
              About TheStare.in
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              TheStare.in is India's premier platform dedicated to supporting aspiring and experienced product managers in advancing their careers through comprehensive resources, community engagement, and professional development opportunities.
            </p>
            <div className="space-y-4 mb-8">
              <div className="bg-muted p-5 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Comprehensive Learning</h3>
                <p className="text-muted-foreground">Access a vast library of case studies, resume templates, portfolio examples, and educational content tailored for the Indian PM landscape.</p>
              </div>
              <div className="bg-muted p-5 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Professional Network</h3>
                <p className="text-muted-foreground">Connect with like-minded product managers, industry experts, and potential mentors to accelerate your career growth.</p>
              </div>
              <div className="bg-muted p-5 rounded-lg">
                <h3 className="font-semibold text-foreground mb-2">Practical Tools</h3>
                <p className="text-muted-foreground">Utilize our curated tools and resources to build impressive portfolios, craft compelling resumes, and prepare for interviews.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;