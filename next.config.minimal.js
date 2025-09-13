/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com'
    ]
  },
  
  env: {
    SKIP_ENV_VALIDATION: 'true'
  },
  
  // Configuración mínima para Vercel
  swcMinify: true,
  compress: true
}

module.exports = nextConfig
