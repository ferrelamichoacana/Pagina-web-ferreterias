import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

// Configuración de Firebase Admin SDK
const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Inicializar Firebase Admin solo si no está ya inicializado
function initFirebaseAdmin() {
  const apps = getApps()
  
  if (apps.length === 0) {
    try {
      const app = initializeApp({
        credential: cert(firebaseAdminConfig),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      })
      
      console.log('🔥 Firebase Admin inicializado correctamente')
      return app
    } catch (error) {
      console.error('❌ Error inicializando Firebase Admin:', error)
      throw error
    }
  }
  
  return apps[0]
}

// Obtener instancia de Firestore
let adminDb: any = null

try {
  initFirebaseAdmin()
  adminDb = getFirestore()
} catch (error) {
  console.error('❌ Error configurando Firebase Admin:', error)
}

export { adminDb }
export default adminDb