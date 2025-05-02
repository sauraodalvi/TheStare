
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Award } from 'lucide-react';

const CreditsSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-md overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-2 rounded-full bg-stare-navy/10 mb-4">
                  <Award className="h-6 w-6 text-stare-navy" />
                </div>
                <h2 className="text-2xl font-bold text-stare-navy mb-4">
                  Credits
                </h2>
                <p className="text-slate-600 mb-8">
                  Special thanks to storyset.com for providing free illustrations
                </p>
                
                <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 text-left mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-stare-navy mb-3">Company</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>About</li>
                      <li>Contact Us</li>
                      <li>Jobs</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-stare-navy mb-3">Job Board</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>Post a job</li>
                      <li>Talent Pool</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-stare-navy mb-3">Case Studies</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>View Case Studies</li>
                      <li>Add Your Work</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-stare-navy mb-3">Resources</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>Self Study</li>
                      <li>Portfolio</li>
                      <li>Resume</li>
                      <li>Articles</li>
                      <li>Interview Questions</li>
                      <li>Courses</li>
                    </ul>
                  </div>
                </div>
                
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div>
                    <h3 className="text-lg font-semibold text-stare-navy mb-3">Support Us</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>Share Testimonial</li>
                      <li>Partnership</li>
                      <li>Volunteer</li>
                      <li>Buy us a coffee</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-stare-navy mb-3">Other Info</h3>
                    <ul className="space-y-2 text-slate-600">
                      <li>Contact Us</li>
                      <li>Terms of Service</li>
                      <li>Privacy Policy</li>
                      <li>Cancellation & Refund Policy</li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-10 pt-6 border-t border-slate-200 text-center w-full">
                  <p className="text-sm text-slate-500">
                    Made with 🧡 by Saurao Dalvi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CreditsSection;
