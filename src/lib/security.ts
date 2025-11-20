import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';

/**
 * Check if the current user has admin privileges
 */
export const isUserAdmin = async (user?: User | null): Promise<boolean> => {
  try {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    return currentUser?.user_metadata?.role === 'admin' || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Secure data access - ensures user can only access their own data unless admin
 */
export const withUserCheck = async <T>(
  userId: string,
  operation: () => Promise<T>,
  options: { adminBypass: boolean } = { adminBypass: true }
): Promise<T> => {
  try {
    const user = await supabase.getUser();
    
    if (!user) {
      throw new Error('Authentication required');
    }

    // Allow admins to bypass ownership check if configured
    if (options.adminBypass && (await isUserAdmin(user))) {
      return operation();
    }

    // Verify the user owns the resource
    if (user.id !== userId) {
      throw new Error('Unauthorized: You can only access your own data');
    }

    return operation();
  } catch (error) {
    console.error('Security check failed:', error);
    throw error;
  }
};

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

/**
 * Secure password validation
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 12) {
    return { valid: false, message: 'Password must be at least 12 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true };
};

/**
 * Rate limiting middleware
 */
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

export const rateLimit = async (
  identifier: string,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): Promise<{ allowed: boolean; remaining: number; reset: number }> => {
  const now = Date.now();
  const reset = now + windowMs;
  
  const entry = rateLimitStore.get(identifier);
  
  if (!entry || now > entry.resetAt) {
    // New or expired entry
    rateLimitStore.set(identifier, { count: 1, resetAt: reset });
    return { allowed: true, remaining: limit - 1, reset };
  }
  
  // Check rate limit
  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, reset: entry.resetAt };
  }
  
  // Increment counter
  rateLimitStore.set(identifier, { ...entry, count: entry.count + 1 });
  return { allowed: true, remaining: limit - entry.count - 1, reset: entry.resetAt };
};
