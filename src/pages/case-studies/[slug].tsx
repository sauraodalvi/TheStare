import { GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { supabase } from '@/lib/supabaseClient';
import { generateCaseStudyStructuredData, generateMetaTags } from '@/lib/seoUtils';
import { Database } from '@/types/supabase';

type CaseStudy = Database['public']['Tables']['case_studies']['Row'];

interface CaseStudyPageProps {
  caseStudy: CaseStudy;
}

export default function CaseStudyPage({ caseStudy }: CaseStudyPageProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!caseStudy) {
    return <div>Case study not found</div>;
  }

  const structuredData = generateCaseStudyStructuredData(caseStudy);
  const metaTags = generateMetaTags(caseStudy);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{caseStudy.seo_meta_title || caseStudy.title}</title>
        {metaTags.map((tag, index) => (
          <meta key={index} {...tag} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>

      <main className="flex-1 container mx-auto px-4 py-8">
        <article className="prose lg:prose-xl max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{caseStudy.title}</h1>
          
          {caseStudy.featured_image && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img
                src={caseStudy.featured_image}
                alt={caseStudy.title}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: caseStudy.content || '' }} />
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">About the Company</h2>
            <p>{caseStudy.company_description}</p>
          </div>
        </article>
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Pre-render only these paths at build time
  const { data: caseStudies } = await supabase
    .from('case_studies')
    .select('slug')
    .eq('seo_index', true);

  const paths = caseStudies?.map((study) => ({
    params: { slug: study.slug },
  })) || [];

  return {
    paths,
    fallback: 'blocking', // Generate new pages on-demand if not pre-rendered
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { data: caseStudy } = await supabase
    .from('case_studies')
    .select('*')
    .eq('slug', params?.slug)
    .single();

  if (!caseStudy) {
    return {
      notFound: true,
    };
  }

  // Only serve indexable case studies in production
  if (process.env.NODE_ENV === 'production' && !caseStudy.seo_index) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      caseStudy,
    },
    revalidate: 60 * 60, // Re-generate page every hour
  };
};
