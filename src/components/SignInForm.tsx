
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { validateForm } from '@/utils/validation';

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
  rememberMe: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, loading: authLoading } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);

    try {
      // Client-side validation
      const validation = validateForm(values.email, values.password);
      if (!validation.valid) {
        toast.error(validation.message || 'Please check your input');
        return;
      }

      const { error } = await signIn(values.email, values.password);

      if (error) {
        toast.error("Sign in failed", { description: error });
        return;
      }

      // Handle successful login
      toast.success("Signed in successfully!");
      
      // Redirect to the intended URL or home
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo, { replace: true });
      
    } catch (error) {
      console.error('Unexpected error during sign in:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
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
                        disabled={isLoading}
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
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link 
                        to="/forgot-password" 
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input 
                        placeholder="••••••••" 
                        {...field} 
                        type="password"
                        autoComplete="current-password"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0 text-sm font-normal">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />
              <Button 
                type="submit" 
                disabled={isLoading || authLoading}
                className="w-full"
              >
                {isLoading || authLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In
                  </>
                )}
              </Button>
              <div className="pt-2"></div>
              <div className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <Link 
                  to="/sign-up" 
                  className="font-medium text-primary hover:underline"
                  onClick={(e) => isLoading && e.preventDefault()}
                >
                  Sign up
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInForm;
