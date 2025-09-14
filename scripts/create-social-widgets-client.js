require('dotenv').config({ path: '.env.local' })

// Usaremos el SDK de cliente Firebase para este script inicial
const { initializeApp } = require('firebase/app')
const { getFirestore, connectFirestoreEmulator, collection, addDoc } = require('firebase/firestore')

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
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
    console.log('🚀 Inicializando Firebase SDK...')
    
    // Verificar configuración
    if (!firebaseConfig.projectId) {
      throw new Error('NEXT_PUBLIC_FIREBASE_PROJECT_ID no está configurado')
    }
    
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    console.log('📱 Creando widgets sociales...')
    
    // Crear widgets uno por uno
    for (const widgetData of socialWidgetsData) {
      try {
        const docRef = await addDoc(collection(db, 'socialWidgets'), widgetData)
        console.log(`✅ Widget creado con ID: ${docRef.id}`)
        console.log(`   URL: ${widgetData.url}`)
        console.log(`   Posición: ${widgetData.position}`)
      } catch (error) {
        console.error(`❌ Error creando widget: ${widgetData.url}`, error.message)
      }
    }
    
    console.log(`\n🎉 ¡Proceso completado!`)
    console.log(`📊 Total de widgets configurados: ${socialWidgetsData.length}`)
    console.log('\n📋 Resumen:')
    socialWidgetsData.forEach((widget, index) => {
      console.log(`${index + 1}. ${widget.type.toUpperCase()} - Posición ${widget.position}`)
      console.log(`   URL: ${widget.url}`)
      console.log(`   Estado: ${widget.active ? 'Activo' : 'Inactivo'}`)
    })
    
    console.log('\n🎯 Próximos pasos:')
    console.log('1. Los widgets aparecerán automáticamente en la página principal')
    console.log('2. Puedes gestionarlos desde el panel de administración → Redes Sociales')
    console.log('3. Verifica que las URLs de Facebook sean públicas')
    console.log('4. Las animaciones se activarán al hacer scroll en la página')
    
  } catch (error) {
    console.error('❌ Error al crear widgets sociales:', error.message)
    
    if (error.message.includes('permission-denied')) {
      console.log('\n🔑 Posibles soluciones:')
      console.log('1. Verifica que las reglas de Firestore permitan escritura')
      console.log('2. Asegúrate de estar autenticado en Firebase')
      console.log('3. Verifica la configuración del proyecto')
    } else if (error.message.includes('FIREBASE_PROJECT_ID')) {
      console.log('\n🔧 Configuración requerida:')
      console.log('1. Verifica que el archivo .env.local tenga todas las variables de Firebase')
      console.log('2. Ejecuta: firebase login')
      console.log('3. Ejecuta: firebase use your-project-id')
    }
  }
}

// Ejecutar el script
createSocialWidgets()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })
