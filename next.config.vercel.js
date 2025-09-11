/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: false, // Mantener ESLint durante el build
  },
  typescript: {
    ignoreBuildErrors: false, // Mantener verificación de TypeScript
  },
  experimental: {
    outputFileTracingIgnores: ['**/*']
  },
  // Optimizaciones para Vercel
  generateBuildId: async () => {
    return 'vercel-build-' + Date.now()
  },
  // Configurar páginas estáticas para evitar timeouts
  staticPageGenerationTimeout: 120,
  // Imágenes optimizadas para Vercel
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },
  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  // Configuración de rutas API para Vercel
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
