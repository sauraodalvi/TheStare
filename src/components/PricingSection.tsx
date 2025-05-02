
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  const handleFreePlanClick = () => {
    toast.success("You're on the Free plan", {
      description: "Enjoy limited access to TheStare resources!",
    });
  };
  
  const handlePaidPlanClick = () => {
    navigate('/sign-up');
    toast.info("Sign up to continue", {
      description: "Create an account to access premium features.",
    });
  };
  
  return (
    <section className="py-16 bg-slate-50">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h1 className="text-4xl font-bold text-stare-navy mb-4">
            Pricing that fits every stage
          </h1>
          <p className="text-lg text-slate-600">
            Whether you are just starting or already a product manager
          </p>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center p-1 bg-white border rounded-lg shadow-sm">
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition ${
                billingCycle === 'yearly'
                  ? 'bg-stare-teal text-white'
                  : 'bg-transparent text-slate-500'
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition ${
                billingCycle === 'monthly'
                  ? 'bg-stare-teal text-white'
                  : 'bg-transparent text-slate-500'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-white rounded-t-lg pt-8 pb-4">
              <CardTitle className="text-2xl font-bold text-stare-navy text-center">
                Free
              </CardTitle>
              <div className="text-center mt-2 mb-2">
                <span className="text-slate-500 text-sm">Ideal for beginners and casual learners</span>
                <div className="mt-4 flex items-end justify-center">
                  <span className="text-4xl font-bold text-stare-navy">$0</span>
                  <span className="text-slate-500 mb-1 ml-1">/ month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-8 px-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Access up to 200 case studies</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Access interview questions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Explore a collection of seasoned PM resumes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Browse portfolios</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Read articles</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-0">
              <Button 
                onClick={handleFreePlanClick} 
                variant="outline" 
                className="w-full border-stare-teal text-stare-teal hover:bg-stare-teal hover:text-white"
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
          
          {/* Premium Plan */}
          <Card className="border-none shadow-md hover:shadow-lg transition-shadow relative overflow-hidden">
            {/* Recommended badge */}
            <div className="absolute top-0 right-0">
              <div className="bg-stare-accent text-white px-4 py-1 text-xs font-semibold uppercase transform rotate-45 translate-x-6 -translate-y-1">
                Popular
              </div>
            </div>
            
            <CardHeader className="bg-white rounded-t-lg pt-8 pb-4">
              <CardTitle className="text-2xl font-bold text-stare-navy text-center">
                Product Managers
              </CardTitle>
              <div className="text-center mt-2 mb-2">
                <span className="text-slate-500 text-sm">For power users</span>
                <div className="mt-4 flex items-end justify-center">
                  <span className="text-4xl font-bold text-stare-navy">
                    {billingCycle === 'yearly' ? '$90' : '$110'}
                  </span>
                  <span className="text-slate-500 mb-1 ml-1">/ month</span>
                </div>
                {billingCycle === 'yearly' && (
                  <div className="mt-2 text-xs text-stare-accent font-medium">
                    Save $240 annually
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-6 pb-8 px-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Access 900+ case studies</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Access interview questions</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Explore a collection of seasoned PM resumes</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Browse portfolios</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-stare-teal mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-600">Read articles</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="px-8 pb-8 pt-0">
              <Button 
                onClick={handlePaidPlanClick}
                className="w-full bg-stare-teal hover:bg-stare-teal/90"
              >
                Subscribe Now
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
