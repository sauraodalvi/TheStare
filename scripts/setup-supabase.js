const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase URL or Service Role Key in environment variables');
  console.error('Please make sure you have a .env file with the following variables:');
  console.error('VITE_SUPABASE_URL=your_supabase_url_here');
  console.error('VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  console.log('🚀 Setting up Supabase security...');
  
  try {
    console.log('1. Please go to your Supabase dashboard:');
    console.log(`   ${supabaseUrl.replace('api', 'app')}/project/_/sql`);
    console.log('2. Copy and paste the contents of the following files in order:');
    console.log('   - scripts/sql/01_initial_setup.sql');
    console.log('   - scripts/sql/migrations.sql');
    console.log('3. Click "Run" to execute the SQL statements');
    
    // Create admin user if email is provided
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      console.log('\n👤 After running the SQL, you can create an admin user with:');
      console.log(`   Email: ${adminEmail}`);
      console.log('   Use the Supabase Auth UI to create the user and assign the admin role');
      console.log('   Or run this SQL in the Supabase SQL editor:');
      console.log(`   INSERT INTO auth.users (email, raw_user_meta_data, role) VALUES ('${adminEmail}', '{"is_admin": true}'::jsonb, 'admin');`);
      console.log('   Then set a password for the user via the Supabase Auth UI');
    }
      });
      
      if (userError) {
        if (userError.message.includes('already registered')) {
          console.log('ℹ️ Admin user already exists');
        } else {
          throw userError;
        }
      } else {
        console.log(`✅ Admin user created: ${userData.user.email}`);
        console.log('🔑 Temporary password sent to user email');
      }
    }
    
    console.log('✨ Setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running migrations:', error.message);
    process.exit(1);
  }
}

// Execute the migrations
runMigrations();
