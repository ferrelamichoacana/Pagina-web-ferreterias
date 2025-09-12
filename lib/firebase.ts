// Configuración robusta de Firebase para desarrollo y producción
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

// Configuración de Firebase con validación
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Verificar que todas las variables estén presentes
const requiredConfig = [
  'apiKey',
  'authDomain', 
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId'
]

const missingConfig = requiredConfig.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig])

if (missingConfig.length > 0 && typeof window !== 'undefined') {
  console.error('❌ Firebase: Variables de configuración faltantes:', missingConfig)
  console.error('   Configura estas variables en tu archivo .env.local o en Vercel')
}

// Variables para las instancias de Firebase
let app: FirebaseApp | null = null
let auth: Auth | null = null  
let db: Firestore | null = null

// Función para inicializar Firebase de forma segura
function initializeFirebase(): { app: FirebaseApp | null, auth: Auth | null, db: Firestore | null } {
  // Solo inicializar en el browser y si tenemos configuración válida
  if (typeof window === 'undefined') {
    return { app: null, auth: null, db: null }
  }

  // Si ya está inicializado, devolver las instancias existentes
  if (app && auth && db) {
    return { app, auth, db }
  }

  try {
    // Verificar si tenemos configuración mínima
    if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
      console.warn('⚠️  Firebase: Configuración incompleta, usando modo dummy')
      return { app: null, auth: null, db: null }
    }

    // Inicializar Firebase
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)

    console.log('✅ Firebase inicializado correctamente')
    console.log(`   📋 Proyecto: ${firebaseConfig.projectId}`)
    
    return { app, auth, db }
    
  } catch (error) {
    console.error('❌ Error inicializando Firebase:', error)
    return { app: null, auth: null, db: null }
  }
}

// Inicializar Firebase
const { app: firebaseApp, auth: firebaseAuth, db: firebaseDb } = initializeFirebase()

// Función helper para verificar si Firebase está disponible
export function isFirebaseConfigured(): boolean {
  return firebaseDb !== null && firebaseAuth !== null
}

// Función para obtener las instancias con verificación
export function getFirebaseInstances() {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase no está configurado. Verifica las variables de entorno.')
  }
  return { app: firebaseApp, auth: firebaseAuth, db: firebaseDb }
}

// Exportar las instancias
export { firebaseAuth as auth, firebaseDb as db }
export default firebaseApp