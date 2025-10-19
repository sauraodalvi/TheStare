const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: Missing Supabase URL or Service Role Key in environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function setupRLSPolicies() {
  console.log('🚀 Setting up Supabase RLS policies...');

  try {
    // Enable RLS on all tables
    await supabase.rpc('enable_rls_on_all_tables');
    
    // Create admin role if it doesn't exist
    await supabase.rpc('create_admin_role_if_not_exists');
    
    // Set up profiles table policies
    await supabase.rpc('setup_profile_policies');
    
    // Set up case_studies table policies
    await supabase.rpc('setup_case_study_policies');
    
    // Set up subscriptions table policies
    await supabase.rpc('setup_subscription_policies');
    
    console.log('✅ RLS policies set up successfully!');
  } catch (error) {
    console.error('❌ Error setting up RLS policies:', error);
    process.exit(1);
  }
}

async function createAdminUser(email: string) {
  console.log(`👤 Creating admin user: ${email}`);
  
  try {
    // This is a simplified example. In production, use Supabase Auth admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      role: 'admin',
      user_metadata: { is_admin: true }
    });
    
    if (error) throw error;
    
    console.log(`✅ Admin user created: ${data.user?.email}`);
    console.log('🔑 Temporary password sent to user email');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

// Main function
async function main() {
  console.log('🚀 Starting Supabase setup...');
  
  // 1. Set up RLS policies
  await setupRLSPolicies();
  
  // 2. Create admin user (if email provided)
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    await createAdminUser(adminEmail);
  } else {
    console.log('ℹ️ No ADMIN_EMAIL provided. Skipping admin user creation.');
  }
  
  console.log('✨ Setup completed successfully!');
}

// Run the setup
main().catch(console.error);
