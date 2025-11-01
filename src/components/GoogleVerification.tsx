import { Helmet } from 'react-helmet-async';

/**
 * GoogleVerification Component
 * 
 * This component injects the Google Search Console verification meta tag
 * into the document head dynamically using react-helmet-async.
 * 
 * This is necessary because Lovable's deployment system overrides the static
 * index.html file, so we need to inject the meta tag at runtime through React.
 */
export const GoogleVerification = () => {
  return (
    <Helmet>
      <meta 
        name="google-site-verification" 
        content="Aq2KeQaMEZHba7S4pWnjzP6JSCweLvO2vQpmDQKym7Y" 
      />
    </Helmet>
  );
};

