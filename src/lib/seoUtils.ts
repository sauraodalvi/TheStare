import { Database } from '@/types/supabase';

type CaseStudy = Database['public']['Tables']['case_studies']['Row'];

export const generateCaseStudyStructuredData = (caseStudy: CaseStudy) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.seo_meta_title || caseStudy.title,
    "description": caseStudy.seo_meta_description || caseStudy.summary,
    "datePublished": caseStudy.published_at,
    "dateModified": caseStudy.updated_at,
    "author": {
      "@type": "Organization",
      "name": "The Stare"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://thestare.com/case-studies/${caseStudy.slug}`
    },
    "image": caseStudy.featured_image || 'https://thestare.com/default-case-study.jpg'
  };
};

export const generateMetaTags = (caseStudy: CaseStudy) => {
  return [
    { name: 'description', content: caseStudy.seo_meta_description || caseStudy.summary },
    { property: 'og:title', content: caseStudy.seo_meta_title || caseStudy.title },
    { property: 'og:description', content: caseStudy.seo_meta_description || caseStudy.summary },
    { property: 'og:type', content: 'article' },
    { property: 'og:url', content: `https://thestare.com/case-studies/${caseStudy.slug}` },
    { property: 'og:image', content: caseStudy.featured_image || 'https://thestare.com/default-case-study.jpg' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: caseStudy.seo_meta_title || caseStudy.title },
    { name: 'twitter:description', content: caseStudy.seo_meta_description || caseStudy.summary },
    { name: 'twitter:image', content: caseStudy.featured_image || 'https://thestare.com/default-case-study.jpg' }
  ];
};
