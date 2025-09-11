// Configuración de seguridad para Firebase
export const SECURITY_CONFIG = {
  // Dominios permitidos para producción
  ALLOWED_DOMAINS: [
    'ferreteria-michoacana.vercel.app',
    'pagina-web-ferreterias.vercel.app', // Agregado para el deploy actual
    'ferrelamichoacana.com',
    'www.ferrelamichoacana.com',
    'localhost:3000' // Solo para desarrollo
  ],

  // Configuración por ambiente
  ENVIRONMENT_CONFIG: {
    development: {
      allowedOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      enableDebug: true,
      allowTestUsers: true
    },
    production: {
      allowedOrigins: [
        'https://ferreteria-michoacana.vercel.app',
        'https://pagina-web-ferreterias.vercel.app', // Agregado para el deploy actual
        'https://ferrelamichoacana.com',
        'https://www.ferrelamichoacana.com'
      ],
      enableDebug: false,
      allowTestUsers: false
    }
  }
}

// Función para validar si el dominio actual es seguro
export function validateCurrentDomain(): boolean {
  if (typeof window === 'undefined') return true // Server-side es seguro
  
  const currentOrigin = window.location.origin
  const currentHostname = window.location.hostname
  const environment = process.env.NODE_ENV || 'development'
  
  // En desarrollo, permitir localhost
  if (environment === 'development' && (currentHostname === 'localhost' || currentHostname === '127.0.0.1')) {
    return true
  }
  
  // Permitir cualquier subdominio de vercel.app en producción
  if (currentHostname.endsWith('.vercel.app')) {
    return true
  }
  
  // Verificar dominios específicos configurados
  const config = SECURITY_CONFIG.ENVIRONMENT_CONFIG[environment as keyof typeof SECURITY_CONFIG.ENVIRONMENT_CONFIG]
  const isAllowed = config.allowedOrigins.includes(currentOrigin)
  
  if (!isAllowed) {
    console.warn(`🔒 Domain validation: ${currentOrigin} not in allowed list:`, config.allowedOrigins)
  }
  
  return isAllowed
}

// Función para validar la configuración de Firebase
export function validateFirebaseConfig(config: any): boolean {
  const requiredFields = [
    'apiKey',
    'authDomain', 
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId'
  ]
  
  return requiredFields.every(field => config[field] && config[field] !== '')
}

// Función para ofuscar información sensible en logs
export function obfuscateApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) return '[INVALID]'
  return `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`
}
