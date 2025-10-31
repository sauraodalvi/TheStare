import { defineConfig, type UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
  const isProduction = mode === 'production';

  return {
    base: '/',
    server: {
      host: "localhost",
      port: 3000,
      strictPort: false,
      open: true,
      proxy: {
        // Proxy API requests to the backend
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      },
    },
    plugins: [
      react(),
      // Temporarily disable lovable-tagger to test compatibility
      // isProduction && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      minify: isProduction ? 'terser' : false,
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      assetsInlineLimit: 4096, // 4kb
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            if (id.includes('node_modules')) {
              // Split vendor chunks
              if (id.includes('@radix-ui')) return 'vendor-radix';
              if (id.includes('@tanstack')) return 'vendor-tanstack';
              if (id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-react';
              if (id.includes('lucide-react')) return 'vendor-lucide';
              return 'vendor';
            }
          },
          entryFileNames: 'assets/js/[name]-[hash].js',
          chunkFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash][extname]',
        },
        treeshake: true,
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
          pure_funcs: ['console.log', 'console.info'],
          passes: 2,
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        '@supabase/supabase-js',
      ],
      esbuildOptions: {
        treeShaking: true,
      },
    },
  };
});
