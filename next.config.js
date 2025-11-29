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
  compress: true,

  // Configuración para react-pdf
  webpack: (config, { isServer }) => {
    // Agregar alias para canvas
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    
    return config
  }
}

module.exports = nextConfig
