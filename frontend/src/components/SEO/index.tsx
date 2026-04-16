import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  noindex?: boolean;
  nofollow?: boolean;
  structuredData?: object;
}

const SEO = ({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage = '/images/og/insular-og-default.jpg',
  ogImageAlt = 'Taller360',
  twitterCard = 'summary_large_image',
  noindex = false,
  nofollow = false,
  structuredData,
}: SEOProps) => {
  const siteUrl = 'https://taller360.local';
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  const fullTitle = title.includes('Taller360') ? title : `${title} | Taller360`;

  const robotsContent = [
    noindex ? 'noindex' : 'index',
    nofollow ? 'nofollow' : 'follow',
  ].join(', ');

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />
      {canonical && <link rel="canonical" href={fullUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content="Taller360" />
      <meta property="og:locale" content="es_VE" />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />
      <meta property="twitter:image:alt" content={ogImageAlt} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#15152D" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="geo.region" content="VE-W" />
      <meta name="geo.placename" content="Caracas" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
