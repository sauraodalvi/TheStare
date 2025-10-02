import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { User as SupabaseUser, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// Extend the Supabase User type with our custom fields
export interface User extends SupabaseUser {
  subscriptionType?: 'free' | 'paid';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<Session | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getAuthError = (error: unknown): string => {
  if (!error) return 'An unknown error occurred';
  
  const errorObj = error as Error | AuthError;
  const message = errorObj.message || errorObj.toString();
  
  if (message.includes('Invalid login credentials')) {
    return 'Invalid email or password';
  }
  if (message.includes('Email not confirmed')) {
    return 'Please verify your email before signing in';
  }
  if (message.includes('rate limit')) {
    return 'Too many attempts. Please try again later.';
  }
  if (message.includes('network error')) {
    return 'Unable to connect to the server. Please check your connection.';
  }
  
  return message;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { session: newSession } } = await supabase.auth.getSession();
      setSession(newSession);
      setUser(newSession?.user ?? null);
      return newSession;
    } catch (error) {
      console.error('Error refreshing session:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Initial session check
        await refreshSession();
        
        // Set up auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            if (!mounted) return;
            
            console.log('Auth state changed:', event);
            setSession(newSession);
            setUser(newSession?.user ?? null);
            
            if (event === 'SIGNED_OUT') {
              setUser(null);
              setSession(null);
            } else if (event === 'TOKEN_REFRESHED') {
              console.log('Token refreshed');
            }
          }
        );

        return () => {
          mounted = false;
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();
  }, [refreshSession]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: getAuthError(error) };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: getAuthError(error) };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshSession
  };

  return (
    <AuthContext.Provider value={value}>
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