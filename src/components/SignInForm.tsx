
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  // Test user creation function
  const createTestUser = async () => {
    const testEmail = 'test@thestare.com';
    const testPassword = 'testpassword123';

    console.log('Creating test user...');
    const { error } = await signUp(testEmail, testPassword);

    if (error) {
      console.error('Test user creation failed:', error);
      toast.error('Test user creation failed', {
        description: error.message
      });
    } else {
      toast.success('Test user created!', {
        description: `Test user: ${testEmail} / ${testPassword}`
      });
    }
  };

  // Quick test sign-in function
  const quickTestSignIn = async () => {
    const testEmail = 'test@thestare.com';
    const testPassword = 'testpassword123';

    // Fill the form with test credentials
    form.setValue('email', testEmail);
    form.setValue('password', testPassword);

    // Trigger sign in
    await onSubmit({ email: testEmail, password: testPassword });
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      console.log('=== SIGN IN ATTEMPT ===');
      console.log('Email:', values.email);
      console.log('Attempting to sign in...');

      const { error } = await signIn(values.email, values.password);

      if (error) {
        console.error('Sign in error:', error);
        console.error('Error code:', error.name);
        console.error('Error message:', error.message);

        // Provide more specific error messages
        let errorMessage = "Please check your email and password";
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = "Please check your email and click the confirmation link before signing in.";
        } else if (error.message.includes('Too many requests')) {
          errorMessage = "Too many sign-in attempts. Please wait a moment and try again.";
        }

        toast.error("Sign in failed", {
          description: errorMessage,
        });
      } else {
        console.log('Sign in successful!');
        toast.success("Signed in successfully!", {
          description: "Welcome back to TheStare",
        });

        // Use setTimeout to ensure authentication state is updated before navigation
        setTimeout(() => {
          try {
            console.log('Navigating to home page...');
            navigate('/', { replace: true });
          } catch (navError) {
            console.error('Navigation error:', navError);
            // Fallback to window.location if navigate fails
            window.location.href = '/';
          }
        }, 100);
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast.error("Sign in failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="bg-card hover:shadow-lg transition-all duration-300 border border-border overflow-hidden">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-foreground">Sign In</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        autoComplete="current-password"
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
                    <span className="mr-2">Signing In</span>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </span>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <div className="text-sm text-muted-foreground">
            Don't have an account? <Link to="/sign-up" className="text-stare-teal hover:underline">Sign Up</Link>
          </div>
          <div className="text-sm text-muted-foreground">
            <Link to="/forgot-password" className="text-stare-teal hover:underline">Forgot Password?</Link>
          </div>

          {/* Test user creation and sign-in buttons - for development/testing */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={createTestUser}
              >
                🧪 Create Test User
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={quickTestSignIn}
              >
                🚀 Quick Test Sign In
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Test credentials: test@thestare.com / testpassword123
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInForm;
