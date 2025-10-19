import { supabase } from '@/lib/supabaseClient';
import { GetServerSideProps } from 'next';

export default function Sitemap() {}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Fetch all indexable case studies
  const { data: caseStudies } = await supabase
    .from('case_studies')
    .select('slug, updated_at')
    .eq('seo_index', true);

  // Generate sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- Static pages -->
      <url>
        <loc>https://thestare.com/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://thestare.com/case-studies</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
      <url>
        <loc>https://thestare.com/resources</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>
      <!-- Dynamic case study pages -->
      ${caseStudies?.map(study => `
        <url>
          <loc>https://thestare.com/case-studies/${study.slug}</loc>
          <lastmod>${new Date(study.updated_at).toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};
