
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Users, UserCheck } from 'lucide-react';

const Referrals = () => {
  return (
    <section id="referrals" className="section-padding bg-slate-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-stare-navy">
            Referral Programs
          </h2>
          <p className="text-lg text-slate-600">
            Our referral system connects talent with opportunities through our trusted community network.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-stare-navy text-white rounded-t-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Get a Referral</h3>
              </div>
              <p className="text-white/80 text-sm">
                Submit your profile and desired job posting to receive referrals from within the Stare community.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-stare-teal/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-stare-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Upload your latest resume</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-stare-teal/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-stare-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Share the job you want to be referred to</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-stare-teal/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-stare-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Get matched with potential referrers</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-stare-teal/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-stare-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Increase your chances of getting an interview</span>
                </li>
              </ul>
              <Button className="w-full bg-stare-navy hover:bg-stare-navy/90">
                Request a Referral <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="bg-stare-teal text-white rounded-t-lg">
              <div className="flex items-center gap-3 mb-2">
                <UserCheck className="h-6 w-6" />
                <h3 className="text-xl font-semibold">Give a Referral</h3>
              </div>
              <p className="text-white/80 text-sm">
                Refer qualified candidates from the Stare network to opportunities within your organization.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-stare-navy/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-stare-navy" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Create your referrer profile</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-stare-navy/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-stare-navy" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700">List the companies you can refer to</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-stare-navy/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-stare-navy" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Review potential candidates</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="rounded-full bg-stare-navy/10 p-1 mt-0.5">
                    <svg className="h-3 w-3 text-stare-navy" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-slate-700">Help fellow PMs grow in their careers</span>
                </li>
              </ul>
              <Button className="w-full bg-stare-teal hover:bg-stare-teal/90">
                Become a Referrer <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Referrals;
