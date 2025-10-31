import { Database } from '@/types/supabase';

type CaseStudy = Database['public']['Tables']['case_studies']['Row'];

// Website Organization Schema
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Stare",
    "url": "https://thestare.com",
    "logo": "https://storage.googleapis.com/gpt-engineer-file-uploads/MvBsCaqL3USx5FrV1BCpFW8r8ui2/uploads/1759781390292-Frame 27.png",
    "description": "Comprehensive platform for product managers offering case studies, resumes, portfolios, and resources",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/thestare",
      "https://linkedin.com/company/thestare"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": "English"
    }
  };
};

// Breadcrumb Schema
export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://thestare.com${item.url}`
    }))
  };
};

// WebSite Schema with SearchAction
export const generateWebsiteSearchSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Stare",
    "url": "https://thestare.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://thestare.com/case-studies?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };
};

// Enhanced Case Study Schema
export const generateCaseStudyStructuredData = (caseStudy: CaseStudy) => {
  const baseSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": caseStudy.seo_meta_title || caseStudy.title,
    "description": caseStudy.seo_meta_description || caseStudy.summary,
    "datePublished": caseStudy.published_at,
    "dateModified": caseStudy.updated_at || caseStudy.published_at,
    "author": {
      "@type": "Organization",
      "name": "The Stare",
      "url": "https://thestare.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "The Stare",
      "logo": {
        "@type": "ImageObject",
        "url": "https://storage.googleapis.com/gpt-engineer-file-uploads/MvBsCaqL3USx5FrV1BCpFW8r8ui2/uploads/1759781390292-Frame 27.png",
        "width": 512,
        "height": 512
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://thestare.com/case-studies/${caseStudy.slug}`
    },
    "image": {
      "@type": "ImageObject",
      "url": caseStudy.featured_image || 'https://thestare.com/default-case-study.jpg',
      "width": 1200,
      "height": 630
    },
    "articleSection": "Product Management",
    "keywords": "product management, case study, PM interview, product strategy",
    "inLanguage": "en-US"
  };

  return baseSchema;
};

// Course/Resource Schema
export const generateCourseSchema = (course: {
  title: string;
  description: string;
  url: string;
  provider?: string;
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": course.provider || "The Stare",
      "sameAs": "https://thestare.com"
    },
    "url": course.url
  };
};

// FAQ Schema
export const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
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
