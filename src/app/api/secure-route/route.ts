import { NextResponse } from 'next/server';
import { withApiAuth, withAdmin } from '@/middleware/apiAuth';
import { supabase } from '@/lib/supabase';

// Example of a secure API route
const secureHandler = async (
  request: Request,
  params: { [key: string]: string },
  user: any
) => {
  try {
    // Example: Get data with user access control
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Secure route error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
};

// Apply authentication middleware
export const GET = withApiAuth(secureHandler);

// Example of an admin-only endpoint
export const POST = withAdmin(async (request, params, user) => {
  try {
    // Admin-only operations here
    return NextResponse.json({ message: 'Admin action successful' });
  } catch (error) {
    console.error('Admin route error:', error);
    return NextResponse.json(
      { error: 'Admin operation failed' },
      { status: 500 }
    );
  }
});
