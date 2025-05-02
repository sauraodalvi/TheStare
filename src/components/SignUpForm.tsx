
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { LogIn, AlertCircle } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

const SignUpForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [planPrice, setPlanPrice] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    // Check if user came from pricing page with a plan selection
    const params = new URLSearchParams(location.search);
    const plan = params.get('plan');
    
    if (plan !== 'premium') {
      // If no premium plan was selected, redirect to pricing
      navigate('/pricing');
      toast.error("Please select a subscription plan first", {
        description: "You need to subscribe before creating an account.",
      });
    }
    
    // Get plan details from session storage
    const storedPlan = sessionStorage.getItem('selectedPlan');
    const storedPrice = sessionStorage.getItem('planPrice');
    
    if (storedPlan) {
      setSelectedPlan(storedPlan);
    }
    
    if (storedPrice) {
      setPlanPrice(storedPrice);
    }
  }, [location.search, navigate]);

  const onSubmit = (values: FormValues) => {
    setIsLoading(true);
    
    // Simulate signup delay
    setTimeout(() => {
      setIsLoading(false);
      
      // Clear plan storage after successful signup
      sessionStorage.removeItem('selectedPlan');
      sessionStorage.removeItem('planPrice');
      
      toast.success("Account created successfully!", {
        description: "Thank you for subscribing to our premium plan.",
      });
      
      // Redirect to home page after signup
      navigate('/');
    }, 1500);
  };

  // If no plan selected, show empty container that will trigger useEffect and redirect
  if (!selectedPlan) {
    return <div className="container max-w-md py-16"></div>;
  }

  return (
    <div className="container max-w-md py-16">
      <Card className="border-none shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-stare-navy">Create an Account</CardTitle>
          <CardDescription>
            Enter your details to complete your premium subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedPlan && (
            <Alert className="mb-6 bg-slate-50 border border-stare-teal/30">
              <AlertCircle className="h-4 w-4 text-stare-teal" />
              <AlertTitle className="text-stare-teal">Selected Plan: {selectedPlan.replace('_', ' ')}</AlertTitle>
              <AlertDescription>
                {planPrice ? `You've selected the ${planPrice} premium plan.` : 'Premium subscription plan'}
              </AlertDescription>
            </Alert>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John Doe" 
                        {...field} 
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        {...field} 
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                className="w-full bg-stare-teal hover:bg-stare-teal/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2">Creating Account</span>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Complete Signup
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col text-center">
          <div className="text-sm text-slate-500">
            Already have an account? <Link to="/sign-in" className="text-stare-teal hover:underline">Sign In</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpForm;
