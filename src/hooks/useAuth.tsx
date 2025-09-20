import React, { useState, useEffect, createContext, useContext } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Extend the Supabase User type with our custom fields
export interface User extends SupabaseUser {
  subscriptionType?: 'free' | 'paid';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('=== AUTH PROVIDER INIT ===');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    console.log('Checking for existing session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check result:', session ? 'Authenticated' : 'Not authenticated', session);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(error => {
      console.error('Error getting session:', error);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('=== SUPABASE SIGN IN DEBUG ===');
    console.log('Attempting sign in for email:', email);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log('Sign in response data:', data);
      console.log('Sign in response error:', error);

      if (data.user) {
        console.log('User signed in successfully:', data.user.email);
        console.log('User confirmed:', data.user.email_confirmed_at);
      }

      return { error };
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      return { error: err };
    }
  };

  const signUp = async (email: string, password: string) => {
    console.log('=== SUPABASE SIGN UP DEBUG ===');
    console.log('Supabase URL:', supabase.supabaseUrl);
    console.log('Attempting sign up for email:', email);

    const redirectUrl = `${window.location.origin}/`;
    console.log('Redirect URL:', redirectUrl);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });

      console.log('Sign up response data:', data);
      console.log('Sign up response error:', error);

      if (data.user) {
        console.log('User created successfully:', data.user.email);
        console.log('User confirmed:', data.user.email_confirmed_at);
        console.log('Confirmation sent:', !data.user.email_confirmed_at);
      }

      return { error };
    } catch (err) {
      console.error('Unexpected error during sign up:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}