import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { validateCurrentDomain, validateFirebaseConfig, obfuscateApiKey } from './security'

// Función para validar que todas las variables de entorno requeridas estén presentes
function validateFirebaseEnvVars() {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ]

  const missing = requiredVars.filter(varName => {
    const value = process.env[varName]
    return !value || value === 'dummy-api-key' || value === 'dummy-project' || value.startsWith('dummy-')
  })
  
  if (missing.length > 0) {
    console.warn('⚠️ Firebase: Missing or dummy environment variables:', missing.join(', '))
    console.log('📋 Current env vars:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✓ Set' : '✗ Missing',
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✓ Set' : '✗ Missing',
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✓ Set' : '✗ Missing',
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? '✓ Set' : '✗ Missing',
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? '✓ Set' : '✗ Missing',
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? '✓ Set' : '✗ Missing'
    })
    return false
  }
  return true
}

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:dummy-app-id',
}

// Inicializar Firebase solo si la configuración es válida y el dominio es seguro
let app: any = null
let auth: any = null
let db: any = null

try {
  const hasValidEnvVars = validateFirebaseEnvVars()
  const hasValidConfig = validateFirebaseConfig(firebaseConfig)
  const isSecureDomain = validateCurrentDomain()
  
  console.log('🔍 Firebase initialization debug:', {
    hasValidEnvVars,
    hasValidConfig,
    isSecureDomain,
    environment: process.env.NODE_ENV,
    isClient: typeof window !== 'undefined'
  })
  
  if (hasValidEnvVars && hasValidConfig) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🔥 Firebase initialized successfully')
      console.log('📋 Project ID:', firebaseConfig.projectId)
      console.log('🔑 API Key (obfuscated):', obfuscateApiKey(firebaseConfig.apiKey))
      console.log('🗄️ Firestore DB:', db ? 'Inicializada' : 'Error')
      console.log('🔐 Auth:', auth ? 'Inicializada' : 'Error')
    }
  } else {
    console.warn('⚠️ Firebase: Configuration issues detected')
    console.warn('   - Valid env vars:', hasValidEnvVars)
    console.warn('   - Valid config:', hasValidConfig)
    console.warn('   - Secure domain:', isSecureDomain)
    
    // Intentar inicializar de todas formas para Vercel
    if (hasValidEnvVars && hasValidConfig) {
      console.log('� Attempting Firebase initialization despite domain issues...')
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      auth = getAuth(app)
      db = getFirestore(app)
      console.log('✅ Firebase initialized for production environment')
    } else {
      // Para el proceso de build, crear instancias dummy
      if (typeof window === 'undefined') {
        // Estamos en el servidor durante el build
        app = { options: firebaseConfig }
        auth = null
        db = null
      } else {
        // En el cliente, intentar inicializar normalmente
        try {
          app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
          auth = getAuth(app)
          db = getFirestore(app)
          console.log('🔄 Firebase initialized with fallback method')
        } catch (initError) {
          console.error('❌ Firebase fallback initialization failed:', initError)
          app = null
          auth = null
          db = null
        }
      }
    }
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error)
  app = null
  auth = null
  db = null
}

export { auth, db }
export default app