import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = Number(process.env.VITE_RATE_LIMIT_WINDOW) || 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.VITE_RATE_LIMIT_MAX_REQUESTS) || 100;

// In-memory rate limit store (replace with Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// List of protected API routes
const PROTECTED_ROUTES = [
  '/api/admin',
  '/api/users',
  '/api/case-studies',
  '/api/upload',
];

// List of public API routes
const PUBLIC_ROUTES = [
  '/api/auth',
  '/api/health',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = request.ip || '127.0.0.1';
  
  // Apply rate limiting
  if (!await applyRateLimit(ip, pathname)) {
    return new NextResponse(
      JSON.stringify({ error: 'Too many requests' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Check if route is protected
  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  if (!isProtected) {
    return NextResponse.next();
  }

  // Check if route is explicitly public
  const isPublic = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  if (isPublic) {
    return NextResponse.next();
  }

  // Verify authentication
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Verify token (replace with your actual token verification logic)
  const isValidToken = await verifyToken(token);
  if (!isValidToken) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid or expired token' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Add security headers
  const response = NextResponse.next();
  setSecurityHeaders(response);
  
  return response;
}

async function applyRateLimit(ip: string, path: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') return true;
  
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitStore.delete(key);
    }
  }
  
  const key = `${ip}:${path}`;
  const entry = rateLimitStore.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  
  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  rateLimitStore.set(key, {
    count: entry.count + 1,
    resetTime: entry.resetTime
  });
  
  return true;
}

async function verifyToken(token: string): Promise<boolean> {
  try {
    // Replace with your actual token verification logic
    // This is a placeholder that always returns true in development
    if (process.env.NODE_ENV === 'development') return true;
    
    // Example: Verify JWT token
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // return !!decoded;
    
    return false; // Default to false in production if not implemented
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

function setSecurityHeaders(response: NextResponse) {
  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'same-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CSP Header (Content Security Policy)
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: http:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://*.googleapis.com",
    "frame-src 'self'",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
}

// Configure which routes to apply the middleware to
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
