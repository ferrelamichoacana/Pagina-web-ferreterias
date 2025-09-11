// Configuración simplificada de Firebase
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'dummy-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'dummy-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'dummy-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:dummy-app-id'
}

// Inicializar Firebase solo si no estamos en build time
let app: any = null
let auth: any = null
let db: any = null

// No inicializar Firebase durante el build de Next.js
const isBuildTime = process.env.NODE_ENV === 'production' && typeof window === 'undefined'

if (!isBuildTime) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)
  } catch (error) {
    console.error('❌ Firebase initialization error:', error)
    app = null
    auth = null
    db = null
  }
} else {
  console.log('🚧 Firebase initialization skipped during build time')
}

export { auth, db }
export default app