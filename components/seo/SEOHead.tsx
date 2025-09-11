import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  publishedTime?: string
  modifiedTime?: string
  noIndex?: boolean
  noFollow?: boolean
}

export default function SEOHead({
  title = 'Ferretería La Michoacana - Materiales de Construcción',
  description = 'Ferretería líder en materiales de construcción. Encuentra todo lo que necesitas para tu proyecto: cemento, varilla, herramientas y más. Cotizaciones gratuitas.',
  keywords = [
    'ferretería',
    'materiales de construcción',
    'cemento',
    'varilla',
    'herramientas',
    'construcción',
    'cotizaciones',
    'México'
  ],
  image = '/images/og-image.jpg',
  url,
  type = 'website',
  author = 'Ferretería La Michoacana',
  publishedTime,
  modifiedTime,
  noIndex = false,
  noFollow = false
}: SEOHeadProps) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ferreteria-michoacana.com'
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`
  
  const robotsContent = [
    noIndex ? 'noindex' : 'index',
    noFollow ? 'nofollow' : 'follow'
  ].join(', ')

  return (
    <Head>
      {/* Metadatos básicos */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author} />
      <meta name="robots" content={robotsContent} />
      
      {/* Viewport y responsive */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content="Ferretería La Michoacana" />
      <meta property="og:locale" content="es_MX" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:site" content="@FerreteriaLM" />
      <meta name="twitter:creator" content="@FerreteriaLM" />
      
      {/* Article metadata (si es artículo) */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          <meta property="article:author" content={author} />
          <meta property="article:section" content="Construcción" />
          {keywords.map((keyword, index) => (
            <meta key={index} property="article:tag" content={keyword} />
          ))}
        </>
      )}
      
      {/* Favicons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Theme color */}
      <meta name="theme-color" content="#16a34a" />
      <meta name="msapplication-TileColor" content="#16a34a" />
      
      {/* Preconnect para performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      
      {/* DNS prefetch */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//res.cloudinary.com" />
      
      {/* Structured Data - Organization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Ferretería La Michoacana",
            "description": description,
            "url": baseUrl,
            "logo": `${baseUrl}/images/logo.png`,
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+52-555-123-4567",
              "contactType": "customer service",
              "availableLanguage": "Spanish"
            },
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "MX",
              "addressRegion": "Ciudad de México"
            },
            "sameAs": [
              "https://facebook.com/ferreteriamichoacana",
              "https://instagram.com/ferreteriamichoacana"
            ]
          })
        }}
      />
      
      {/* Structured Data - LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HardwareStore",
            "name": "Ferretería La Michoacana",
            "description": description,
            "url": baseUrl,
            "telephone": "+52-555-123-4567",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "MX",
              "addressRegion": "Ciudad de México"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "19.4326",
              "longitude": "-99.1332"
            },
            "openingHours": [
              "Mo-Fr 08:00-18:00",
              "Sa 08:00-16:00"
            ],
            "paymentAccepted": "Cash, Credit Card, Debit Card",
            "currenciesAccepted": "MXN"
          })
        }}
      />
    </Head>
  )
}