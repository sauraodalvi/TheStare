
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Award, Calendar } from 'lucide-react';

const ParticipateContent = () => {
  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold font-display mb-4 text-stare-navy">Where can I participate in case challenges?</h1>
        
        <div className="prose prose-slate max-w-none mb-10">
          <p className="text-lg text-slate-700">
            The portfolio of a product manager is a crucial document for any prospective employers. 
            An excellent product manager portfolio highlights a product manager's abilities, successes, 
            and experience to illustrate why they would make the best hire for a certain position.
          </p>
          <p className="text-lg font-medium text-stare-navy">
            So please take part, even if you don't win you can add it to your portfolio!
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="border-t-4 border-t-blue-500">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">The Product Folks</h3>
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-stare-navy font-medium mb-2">Monthly Challenges</p>
              <p className="text-slate-600 text-sm mb-6">
                Regular product case challenges with networking opportunities and mentorship from industry experts.
              </p>
              <Button className="w-full" variant="outline">
                <a href="#" className="flex items-center justify-center w-full">
                  Read more <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-green-500">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">PMSchool.in</h3>
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <p className="text-stare-navy font-medium mb-2">Weekly Challenges</p>
              <p className="text-slate-600 text-sm mb-6">
                Intensive weekly challenges focused on building practical product management skills in real-world scenarios.
              </p>
              <Button className="w-full" variant="outline">
                <a href="#" className="flex items-center justify-center w-full">
                  Read more <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-t-purple-500">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">Unstop.com</h3>
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-stare-navy font-medium mb-2">Frequent Challenges</p>
              <p className="text-slate-600 text-sm mb-6">
                Platform hosting various product challenges from top companies with opportunities for recognition and jobs.
              </p>
              <Button className="w-full" variant="outline">
                <a href="#" className="flex items-center justify-center w-full">
                  Read more <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-12 p-6 bg-slate-50 rounded-lg border border-slate-200">
          <h3 className="text-xl font-bold mb-4">Benefits of Participating in Case Challenges</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="bg-stare-teal text-white rounded-full p-1 mr-3 mt-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Enhances your portfolio with real-world problem-solving examples</span>
            </li>
            <li className="flex items-start">
              <span className="bg-stare-teal text-white rounded-full p-1 mr-3 mt-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Build networking opportunities with industry professionals</span>
            </li>
            <li className="flex items-start">
              <span className="bg-stare-teal text-white rounded-full p-1 mr-3 mt-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Gain recognition and credibility in the product management community</span>
            </li>
            <li className="flex items-start">
              <span className="bg-stare-teal text-white rounded-full p-1 mr-3 mt-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <span>Practice applying product frameworks in realistic scenarios</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ParticipateContent;
