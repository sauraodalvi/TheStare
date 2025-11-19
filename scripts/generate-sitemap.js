import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables:');
  console.error('   VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSitemap() {
  const baseUrl = 'https://thestare.com';
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/case-studies', priority: '0.9', changefreq: 'daily' },
    { url: '/resources', priority: '0.8', changefreq: 'weekly' },
    { url: '/courses', priority: '0.8', changefreq: 'weekly' },
    { url: '/portfolio', priority: '0.7', changefreq: 'weekly' },
    { url: '/resume', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/pricing', priority: '0.8', changefreq: 'monthly' },
    { url: '/self-study', priority: '0.7', changefreq: 'weekly' },
  ];

  console.log('📋 Generating sitemap...');
  console.log('   Fetching case studies from Supabase...');

  try {
    // Fetch case studies
    const { data: caseStudies, error } = await supabase
      .from('case_studies')
      .select('slug, updated_at, seo_index')
      .eq('seo_index', true);

    if (error) {
      console.error('❌ Error fetching case studies:', error.message);
      // Continue with static pages only
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    // Add static pages
    console.log(`   Adding ${staticPages.length} static pages...`);
    staticPages.forEach(page => {
      sitemap += `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // Add dynamic case studies
    if (caseStudies && caseStudies.length > 0) {
      console.log(`   Adding ${caseStudies.length} case study pages...`);
      caseStudies.forEach(study => {
        if (study.slug) {
          const lastmod = study.updated_at
            ? new Date(study.updated_at).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0];
          sitemap += `  <url>
    <loc>${baseUrl}/case-studies/${study.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
        }
      });
    } else {
      console.log('   No case studies found with seo_index=true');
    }

    sitemap += `</urlset>`;

    // Write to public directory
    const publicPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
    fs.writeFileSync(publicPath, sitemap, 'utf8');
    console.log('✅ Sitemap generated successfully!');
    console.log(`   Location: ${publicPath}`);
    console.log(`   Total URLs: ${staticPages.length + (caseStudies?.length || 0)}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap();
