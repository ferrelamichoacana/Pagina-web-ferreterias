require('dotenv').config({ path: '.env.local' })

const { initializeApp, getApps } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
const { credential } = require('firebase-admin')

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
      auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
    }

    initializeApp({
      credential: credential.cert(serviceAccount),
    })
  }
  return getFirestore()
}

// Datos de los widgets sociales iniciales
const socialWidgetsData = [
  {
    type: 'facebook',
    url: 'https://www.facebook.com/reel/438869612398491',
    position: 1,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'facebook',
    url: 'https://www.facebook.com/reel/1087534386341829',
    position: 2,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    type: 'facebook',
    url: 'https://www.facebook.com/reel/1566856137583346',
    position: 3,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

async function createSocialWidgets() {
  try {
    console.log('🚀 Inicializando Firebase Admin SDK...')
    const db = initFirebaseAdmin()
    
    console.log('📱 Creando colección socialWidgets...')
    const batch = db.batch()
    
    // Verificar si ya existen widgets
    const existingWidgets = await db.collection('socialWidgets').get()
    
    if (!existingWidgets.empty) {
      console.log('⚠️ Ya existen widgets sociales. Los actualizaremos...')
      
      // Eliminar widgets existentes
      for (const doc of existingWidgets.docs) {
        batch.delete(doc.ref)
      }
    }
    
    // Crear nuevos widgets
    for (const widgetData of socialWidgetsData) {
      const docRef = db.collection('socialWidgets').doc()
      batch.set(docRef, widgetData)
      console.log(`✅ Widget agregado: ${widgetData.url} (Posición ${widgetData.position})`)
    }
    
    // Ejecutar batch
    await batch.commit()
    
    console.log(`\n🎉 ¡Widgets sociales creados exitosamente!`)
    console.log(`📊 Total de widgets: ${socialWidgetsData.length}`)
    console.log('\n📋 Resumen:')
    socialWidgetsData.forEach((widget, index) => {
      console.log(`${index + 1}. ${widget.type.toUpperCase()} - Posición ${widget.position}`)
      console.log(`   URL: ${widget.url}`)
      console.log(`   Estado: ${widget.active ? 'Activo' : 'Inactivo'}`)
    })
    
    console.log('\n🎯 Próximos pasos:')
    console.log('1. Los widgets aparecerán automáticamente en la página principal')
    console.log('2. Puedes gestionarlos desde el panel de administración')
    console.log('3. Verifica que las URLs de Facebook sean públicas')
    
    process.exit(0)
    
  } catch (error) {
    console.error('❌ Error al crear widgets sociales:', error)
    
    if (error.message.includes('permission-denied')) {
      console.log('\n🔑 Posibles soluciones:')
      console.log('1. Verifica que las variables de entorno de Firebase estén configuradas')
      console.log('2. Asegúrate de que las reglas de Firestore permitan escritura')
      console.log('3. Verifica la configuración del service account')
    }
    
    process.exit(1)
  }
}

// Ejecutar el script
createSocialWidgets()
