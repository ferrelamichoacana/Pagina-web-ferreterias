import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ferreteria-michoacana.com'
  
  const robots = `User-agent: *
Allow: /
Allow: /contacto
Allow: /sucursales
Allow: /empleos
Allow: /auth/login
Allow: /auth/register

# Disallow private areas
Disallow: /dashboard/
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /auth/

# Disallow specific file types
Disallow: *.json$
Disallow: *.xml$

# Crawl delay
Crawl-delay: 1

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Popular search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 2`

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400' // 24 horas
    }
  })
}