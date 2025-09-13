/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración básica sin optimizaciones experimentales
  images: {
    domains: [
      'res.cloudinary.com',
      'cloudinary.com',
      'images.unsplash.com',
      'via.placeholder.com'
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Configuración de compresión
  compress: true,

  // Configuración de headers básicos
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ]
  },

  // Configuración de webpack simplificada
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname)
    }
    return config
  },

  // Configuración de ESLint
  eslint: {
    dirs: ['pages', 'components', 'lib', 'app']
  },

  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig