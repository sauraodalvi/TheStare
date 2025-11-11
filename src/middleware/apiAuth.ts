import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

type ApiHandler = (
  request: Request,
  params: { [key: string]: string },
  user: any
) => Promise<Response>;

export function withApiAuth(handler: ApiHandler) {
  return async (request: Request, { params }: { params: { [key: string]: string } }) => {
    try {
      // Get the authorization header
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new NextResponse(
          JSON.stringify({ error: 'Missing or invalid authorization token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Extract the token
      const token = authHeader.split(' ')[1];
      
      // Verify the token
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid or expired token' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Add rate limiting check here if needed
      
      // Call the handler with the authenticated user
      return handler(request, params, user);
      
    } catch (error) {
      console.error('API Auth Error:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

// Admin-only middleware
export function withAdmin(handler: ApiHandler) {
  return withApiAuth(async (request, params, user) => {
    if (user.user_metadata?.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return handler(request, params, user);
  });
}
