# Admin Dashboard Setup Instructions

## 🚨 **CRITICAL: Service Role Key Required**

The admin dashboard requires a Supabase **service_role** key to access admin APIs and bypass Row Level Security (RLS) policies. This is different from the public `anon` key.

## 📋 **Step-by-Step Setup**

### 1. **Get Your Service Role Key from Supabase**

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to your project: `rnpxnaqfoqdivxrlozfr`
3. Go to **Settings** → **API**
4. In the **Project API keys** section, find the **service_role** key
5. Copy the **service_role** key (it should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 2. **Add the Service Role Key to Your Environment**

Update your `.env` file:

```env

# Admin Dashboard Configuration
VITE_ADMIN_PASSWORD="Pass@123"
VITE_SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJucHhuYXFmb3FkaXZ4cmxvemZyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODc1NzEzMywiZXhwIjoyMDY0MzMzMTMzfQ.s8dcBd1Yg45uKrOqR8mH-RzD7hQxqlPCwKds366RszI"
```

**⚠️ SECURITY WARNING:**
- The service_role key has **full database access**
- Never expose it in client-side code in production
- For this admin dashboard, it's acceptable since it's environment-variable based
- Consider implementing server-side admin APIs for production use

### 3. **Restart Your Development Server**

After adding the service_role key:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 4. **Test Admin Access**

1. Navigate to: `http://localhost:3000/admin`
2. Enter password: `Pass@123`
3. The dashboard should now load user data without 403 errors

## 🔧 **Troubleshooting**

### If you still get 403 errors:

1. **Verify the service_role key is correct:**
   - Check the browser console for configuration logs
   - Ensure the key starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`
   - Verify it's the **service_role** key, not the **anon** key

2. **Check environment variable loading:**
   - Open browser console and look for "🔧 Supabase Admin Client Configuration" logs
   - Both URL and Service Role Key should show "✅ Configured"

3. **Verify Supabase project settings:**
   - Ensure your Supabase project is active
   - Check that the profiles table exists
   - Verify RLS policies are properly configured

### If you can't find the service_role key:

1. You might not have admin access to the Supabase project
2. Contact the project owner to get the service_role key
3. Alternatively, the project owner can add you as a collaborator

## 🎯 **Expected Behavior After Setup**

Once properly configured, the admin dashboard will:

- ✅ Load user data without 403 errors
- ✅ Display user analytics and metrics
- ✅ Allow user profile management
- ✅ Enable subscription management
- ✅ Provide bulk operations functionality

## 📞 **Need Help?**

If you continue to experience issues:

1. Check the browser console for detailed error messages
2. Verify all environment variables are properly set
3. Ensure the development server restarted after adding the service_role key
4. Confirm you're using the correct Supabase project URL and keys

---

**Current Configuration Status:**
- ✅ Admin password: `Pass@123`
- ✅ Admin URL: `http://localhost:3000/admin`
- ❌ Service role key: **REQUIRED - Please add to .env file**
