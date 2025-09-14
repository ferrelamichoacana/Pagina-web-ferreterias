import { initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { credential } from 'firebase-admin'

// Inicializar Firebase Admin SDK
function initFirebaseAdmin() {
  if (getApps().length === 0) {
    const serviceAccount = {
      type: "service_account",
      project_id: process.env.FIREBASE_PROJECT_ID,
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      client_id: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      token_uri: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
    }

    initializeApp({
      credential: credential.cert(serviceAccount as any),
      projectId: process.env.FIREBASE_PROJECT_ID
    })
  }
}

async function createSocialWidgetsCollection() {
  try {
    initFirebaseAdmin()
    const db = getFirestore()

    const socialWidgets = [
      {
        id: 'widget-1',
        type: 'facebook',
        url: 'https://www.facebook.com/share/r/16ze1mLE7f/',
        position: 1,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'widget-2', 
        type: 'facebook',
        url: 'https://www.facebook.com/share/r/1KWz1riqHH/',
        position: 2,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'widget-3',
        type: 'facebook', 
        url: 'https://www.facebook.com/share/r/1KWz1riqHH/',
        position: 3,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    console.log('📱 Creando colección socialWidgets...')

    for (const widget of socialWidgets) {
      await db.collection('socialWidgets').doc(widget.id).set(widget)
      console.log(`✅ Widget ${widget.id} creado exitosamente`)
    }

    console.log('🎉 Colección socialWidgets creada exitosamente')
    console.log('📊 Widgets iniciales configurados:', socialWidgets.length)

  } catch (error) {
    console.error('❌ Error creando colección socialWidgets:', error)
    throw error
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  createSocialWidgetsCollection()
    .then(() => {
      console.log('✅ Proceso completado')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Error en el proceso:', error)
      process.exit(1)
    })
}

export { createSocialWidgetsCollection }
