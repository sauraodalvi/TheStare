import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey, X-Admin-Password",
};

const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD') || 'Pass@123';

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const adminPassword = req.headers.get('X-Admin-Password');
    if (!adminPassword || adminPassword !== ADMIN_PASSWORD) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized', message: 'Invalid admin password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    if (req.method === 'GET') {
      if (path === 'users') {
        return await handleGetUsers(supabaseAdmin, url, corsHeaders);
      } else if (path === 'analytics') {
        return await handleGetAnalytics(supabaseAdmin, corsHeaders);
      } else if (url.searchParams.has('userId')) {
        return await handleGetUser(supabaseAdmin, url.searchParams.get('userId')!, corsHeaders);
      }
    } else if (req.method === 'PUT') {
      const body = await req.json();
      return await handleUpdateUser(supabaseAdmin, body, corsHeaders);
    } else if (req.method === 'DELETE') {
      const body = await req.json();
      return await handleDeleteUser(supabaseAdmin, body.userId, corsHeaders);
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Admin operations error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function handleGetUsers(supabaseAdmin: any, url: URL, corsHeaders: any) {
  const query = url.searchParams.get('query') || '';
  const sortBy = url.searchParams.get('sort_by') || 'created_at';
  const sortOrder = url.searchParams.get('sort_order') || 'desc';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '50');

  let queryBuilder = supabaseAdmin
    .from('profiles')
    .select(`
      id,
      email,
      full_name,
      avatar_url,
      subscription_type,
      subscription_end_date,
      career_status,
      uploaded_case_study_count,
      profile_completion_percentage,
      created_at,
      last_login_at,
      is_featured,
      is_blocked
    `, { count: 'exact' });

  if (query.trim()) {
    queryBuilder = queryBuilder.or(`
      email.ilike.%${query}%,
      full_name.ilike.%${query}%,
      current_company.ilike.%${query}%,
      current_role.ilike.%${query}%
    `);
  }

  queryBuilder = queryBuilder.order(sortBy, { ascending: sortOrder === 'asc' });

  const offset = (page - 1) * limit;
  queryBuilder = queryBuilder.range(offset, offset + limit - 1);

  const { data, error, count } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  const normalized = (data || []).map((u: any) => {
    const st = u.subscription_type;
    const isPaid = typeof st === 'number'
      ? st === 1
      : (typeof st === 'string' && st.toLowerCase().trim() === 'paid');
    return {
      ...u,
      subscription_type: isPaid ? 'paid' : 'free',
    };
  });

  return new Response(
    JSON.stringify({
      data: normalized,
      totalCount: count || 0,
      hasMore: (offset + normalized.length) < (count || 0)
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetUser(supabaseAdmin: any, userId: string, corsHeaders: any) {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return new Response(
        JSON.stringify({ error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  const stVal = data?.subscription_type;
  const isPaid = typeof stVal === 'number'
    ? stVal === 1
    : (typeof stVal === 'string' && stVal.toLowerCase().trim() === 'paid');

  return new Response(
    JSON.stringify({
      ...data,
      subscription_type: isPaid ? 'paid' : 'free',
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleUpdateUser(supabaseAdmin: any, body: any, corsHeaders: any) {
  const { userId, updates } = body;
  
  const updateData: any = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  if (updates.subscription_type || updates.subscription_end_date) {
    updateData.subscription_updated_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from('profiles')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }

  const stVal = data?.subscription_type;
  const isPaid = typeof stVal === 'number'
    ? stVal === 1
    : (typeof stVal === 'string' && stVal.toLowerCase().trim() === 'paid');

  return new Response(
    JSON.stringify({
      ...data,
      subscription_type: isPaid ? 'paid' : 'free',
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleDeleteUser(supabaseAdmin: any, userId: string, corsHeaders: any) {
  const { error } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetAnalytics(supabaseAdmin: any, corsHeaders: any) {
  const { data: allUsers, error } = await supabaseAdmin
    .from('profiles')
    .select('subscription_type, career_status, created_at, last_login_at, is_featured, is_blocked, uploaded_case_study_count, profile_completion_percentage');

  if (error) {
    throw new Error(`Failed to fetch analytics: ${error.message}`);
  }

  const users = allUsers || [];
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const isPaid = (u: any) => {
    const t = u?.subscription_type;
    if (typeof t === 'number') return t === 1;
    if (typeof t === 'string') {
      const n = t.toLowerCase().trim();
      return n === 'paid' || n === '1';
    }
    return false;
  };

  const analytics = {
    total_users: users.length,
    free_users: users.filter((u: any) => !isPaid(u)).length,
    paid_users: users.filter((u: any) => isPaid(u)).length,
    active_users_30d: users.filter((u: any) => u.last_login_at && new Date(u.last_login_at) >= thirtyDaysAgo).length,
    new_users_30d: users.filter((u: any) => new Date(u.created_at) >= thirtyDaysAgo).length,
    featured_users: users.filter((u: any) => u.is_featured).length,
    blocked_users: users.filter((u: any) => u.is_blocked).length,
    avg_profile_completion: users.length > 0 
      ? Math.round(users.reduce((sum: number, u: any) => sum + (u.profile_completion_percentage || 0), 0) / users.length)
      : 0,
    total_case_studies_uploaded: users.reduce((sum: number, u: any) => sum + (u.uploaded_case_study_count || 0), 0),
    career_status_breakdown: {
      job_seeker: users.filter((u: any) => u.career_status === 'job_seeker').length,
      hiring: users.filter((u: any) => u.career_status === 'hiring').length,
      employed: users.filter((u: any) => u.career_status === 'employed').length,
      not_specified: users.filter((u: any) => u.career_status === 'not_specified').length,
    },
    subscription_expiring_soon: 0
  };

  return new Response(
    JSON.stringify(analytics),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
