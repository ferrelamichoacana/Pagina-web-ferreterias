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

  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    console.warn('⚠️ Firebase: Missing environment variables:', missing.join(', '))
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
  
  if (hasValidEnvVars && hasValidConfig && isSecureDomain) {
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
    console.warn('⚠️ Firebase: Using dummy configuration for build process')
    console.warn('   - Valid env vars:', hasValidEnvVars)
    console.warn('   - Valid config:', hasValidConfig)
    console.warn('   - Secure domain:', isSecureDomain)
    
    // Mostrar más detalles en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Debugging Firebase config:')
      console.log('   - API Key presente:', !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
      console.log('   - Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
      console.log('   - Auth Domain:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
    }
    
    // Para el proceso de build, crear instancias dummy
    if (typeof window === 'undefined') {
      // Estamos en el servidor durante el build
      app = { options: firebaseConfig }
      auth = null
      db = null
    } else {
      // En el cliente, inicializar normalmente (aunque falle)
      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
      auth = getAuth(app)
      db = getFirestore(app)
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