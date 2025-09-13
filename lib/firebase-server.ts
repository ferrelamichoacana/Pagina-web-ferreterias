// Configuración de Firebase optimizada para funcionar en desarrollo y producción
import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

// Configuración de Firebase con validación
function getFirebaseConfig() {
  const config = {
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

  const missingConfig = requiredConfig.filter(key => !config[key as keyof typeof config])

  if (missingConfig.length > 0) {
    console.error('❌ Firebase: Variables de configuración faltantes:', missingConfig)
    console.error('   Variables disponibles:', Object.keys(process.env).filter(k => k.includes('FIREBASE')))
    return null
  }

  return config
}

// Variables para las instancias de Firebase
let app: FirebaseApp | null = null
let auth: Auth | null = null  
let db: Firestore | null = null

// Función para inicializar Firebase de forma segura y dinámica
function initializeFirebase(): { app: FirebaseApp | null, auth: Auth | null, db: Firestore | null } {
  try {
    // Si ya está inicializado, devolver las instancias existentes
    if (app && auth && db) {
      return { app, auth, db }
    }

    // Obtener configuración
    const firebaseConfig = getFirebaseConfig()
    
    if (!firebaseConfig) {
      console.warn('⚠️  Firebase: Configuración no disponible')
      return { app: null, auth: null, db: null }
    }

    // Inicializar Firebase
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
    auth = getAuth(app)
    db = getFirestore(app)

    const logMessage = `✅ Firebase inicializado: ${firebaseConfig.projectId}`
    if (typeof window !== 'undefined') {
      console.log(logMessage)
    } else {
      // En servidor, usar un log más simple
      console.log(logMessage)
    }
    
    return { app, auth, db }
    
  } catch (error) {
    const errorMessage = `❌ Error inicializando Firebase: ${error}`
    if (typeof window !== 'undefined') {
      console.error(errorMessage)
    } else {
      console.error(errorMessage)
    }
    return { app: null, auth: null, db: null }
  }
}

// Función helper para verificar si Firebase está disponible
export function isFirebaseConfigured(): boolean {
  const { app, auth, db } = initializeFirebase()
  return app !== null && auth !== null && db !== null
}

// Función para obtener las instancias con verificación
export function getFirebaseInstances() {
  const { app, auth, db } = initializeFirebase()
  
  if (!app || !auth || !db) {
    throw new Error('Firebase no está configurado. Verifica las variables de entorno.')
  }
  
  return { app, auth, db }
}

// Funciones de conveniencia
export function getFirebaseAuth(): Auth {
  const { auth } = getFirebaseInstances()
  return auth
}

export function getFirebaseDB(): Firestore {
  const { db } = getFirebaseInstances()
  return db
}

// Exportar las instancias inicializadas
export const { app: firebaseApp, auth: firebaseAuth, db: firebaseDb } = initializeFirebase()

// Exportar instancias con nombres cortos para compatibilidad
export { firebaseAuth as auth, firebaseDb as db }
export default firebaseApp
