module.exports = {
  // Build configuration
  build: {
    outputDir: '.output',
    publicDir: 'public',
    // Add any build-time environment variables here
    env: {
      NODE_ENV: 'production',
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
    }
  },

  // Deployment targets
  targets: [
    {
      name: 'production',
      type: 'static',
      // Add your production deployment configuration here
      // This will vary based on your hosting provider
      provider: 'netlify', // or 'vercel', 'cloudflare', etc.
      config: {
        // Provider-specific configuration
      }
    }
  ],

  // Pre-deployment hooks
  hooks: {
    preBuild: 'npm run lint && npm run type-check',
    postBuild: 'npm run test:ci',
    preDeploy: 'node scripts/check-env.js',
    postDeploy: 'node scripts/notify.js'
  },

  // Environment validation
  validateEnv: () => {
    const requiredVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(`❌ Missing required environment variables: ${missingVars.join(', ')}`);
      process.exit(1);
    }
  }
};
