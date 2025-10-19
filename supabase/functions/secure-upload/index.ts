import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/svg+xml',
];

// Rate limiting
const uploadLimits = new Map();
const RATE_LIMIT = {
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
  MAX_UPLOADS: 20, // Max uploads per window
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to validate JWT
async function validateAuthToken(authHeader: string | null) {
  if (!authHeader) return false;
  
  try {
    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );
    
    const { data, error } = await supabase.auth.getUser(token);
    return !error && data?.user;
  } catch (error) {
    console.error('Error validating auth token:', error);
    return false;
  }
}

// Sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^\w\d\.\-]/g, '_')
    .replace(/\.+/g, '.')
    .replace(/^_+|_+$/g, '')
    .substring(0, 255);
}

// Generate a secure filename with UUID
function generateSecureFilename(originalName: string, userId: string): string {
  const ext = originalName.split('.').pop() || '';
  const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
  const sanitizedBase = sanitizeFilename(baseName);
  return `${userId}_${Date.now()}_${sanitizedBase}.${ext}`.toLowerCase();
}

// Main request handler
serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      } 
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'method_not_allowed', message: 'Only POST method is allowed' }),
        { 
          status: 405, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Verify JWT token
    const authHeader = req.headers.get('Authorization');
    const isAuthenticated = await validateAuthToken(authHeader);
    
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ error: 'unauthorized', message: 'Valid authorization token is required' }),
        { 
          status: 401, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Rate limiting
    const userIp = req.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    const userUploads = uploadLimits.get(userIp) || [];
    
    // Remove old uploads from the window
    const recentUploads = userUploads.filter((timestamp: number) => 
      now - timestamp < RATE_LIMIT.WINDOW_MS
    );

    // Check if user has exceeded rate limit
    if (recentUploads.length >= RATE_LIMIT.MAX_UPLOADS) {
      return new Response(
        JSON.stringify({ 
          error: 'rate_limit_exceeded', 
          message: 'Too many uploads. Please try again later.' 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Update rate limit
    recentUploads.push(now);
    uploadLimits.set(userIp, recentUploads);

    // Parse form data
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const fileType = (formData.get('type') as string)?.toLowerCase() || '';
    
    // Validate file exists
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'no_file', message: 'No file provided' }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return new Response(
        JSON.stringify({ 
          error: 'invalid_file_type', 
          message: `Invalid file type. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}` 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ 
          error: 'file_too_large', 
          message: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
        }),
        { 
          status: 400, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Get Google Service Account credentials
    const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON') || 
                             Deno.env.get('GOOGLE_SERVICE_ACCOUNT_KEY');
    
    if (!serviceAccountJson) {
      console.error('Google Service Account JSON not found in environment variables');
      return new Response(
        JSON.stringify({
          error: 'configuration_error',
          message: 'Service account not configured',
        }),
        { 
          status: 500, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Generate secure filename
    const userId = 'user123'; // Replace with actual user ID from JWT
    const secureFilename = generateSecureFilename(file.name, userId);
    
    // Here you would add the code to upload to Google Drive
    // For now, we'll return a success response with the generated filename
    
    return new Response(
      JSON.stringify({
        success: true,
        filename: secureFilename,
        originalName: file.name,
        size: file.size,
        type: file.type,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in secure-upload function:', {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    return new Response(
      JSON.stringify({
        error: 'internal_error',
        message: 'An error occurred while processing your request',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
