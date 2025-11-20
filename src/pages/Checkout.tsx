import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Checkout = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/sign-in?redirect=/pricing');
    }
  }, [user, navigate]);

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    
    try {
      // In a real app, this would integrate with a payment processor
      // For now, we'll simulate a successful payment
      
      // Calculate subscription end date (30 days from now)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_type: 'paid',
          subscription_start_date: new Date().toISOString(),
          subscription_end_date: endDate.toISOString(),
          subscription_updated_at: new Date().toISOString(),
          subscription_updated_by: user.id,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Subscription Updated',
        description: 'Your subscription has been successfully upgraded to Premium!',
      });
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
      
    } catch (error) {
      console.error('Error processing subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to process subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const price = plan === 'monthly' ? 19.99 : 199.99;
  const billingCycle = plan === 'monthly' ? 'month' : 'year';

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Upgrade to Premium</h1>
            <p className="text-muted-foreground">Choose your plan and start your journey to becoming a better product manager</p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center p-1 rounded-md bg-muted text-muted-foreground">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  plan === 'monthly' ? 'bg-background text-foreground shadow' : ''
                }`}
                onClick={() => setPlan('monthly')}
              >
                Monthly
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  plan === 'yearly' ? 'bg-background text-foreground shadow' : ''
                }`}
                onClick={() => setPlan('yearly')}
              >
                Yearly (Save 15%)
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Premium Plan</CardTitle>
                <CardDescription>
                  Full access to all features
                </CardDescription>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${price}</span>
                  <span className="text-muted-foreground">/{billingCycle}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited case study access
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    AI-powered case study review
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Exclusive templates
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Get Started'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Free Plan</CardTitle>
                <CardDescription>Basic access</CardDescription>
                <div className="mt-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/forever</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Limited case study access
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Basic templates
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Community support
                  </li>
                  <li className="flex items-center text-muted-foreground">
                    <svg className="h-5 w-5 text-muted-foreground mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No AI case study review
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="lg"
                  onClick={() => navigate('/profile')}
                >
                  Stay on Free Plan
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">Can I cancel anytime?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </div>
              <div>
                <h4 className="font-medium">Is there a free trial?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a 7-day free trial for new users. No credit card required to start the trial.
                </p>
              </div>
              <div>
                <h4 className="font-medium">What payment methods do you accept?</h4>
                <p className="text-sm text-muted-foreground">
                  We accept all major credit cards including Visa, Mastercard, American Express, and Discover.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
