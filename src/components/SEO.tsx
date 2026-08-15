import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export default function SEO({
  title,
  description,
  canonical,
  robots = 'index, follow',
  ogType = 'website',
  jsonLd,
}: SEOProps) {
  const { pathname } = useLocation();

  // Establish canonical URL logic
  const domain = 'https://saienterprises.in';
  const defaultCanonical = `${domain}${pathname === '/' ? '' : pathname}`;
  const canonicalUrl = canonical || defaultCanonical;

  // Build JSON-LD array
  const jsonLdArray = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robots} />

      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={ogType} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* JSON-LD Structured Data Injection */}
      {jsonLdArray.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
