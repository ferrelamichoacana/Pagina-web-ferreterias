#!/usr/bin/env npx ts-node --project tsconfig.node.json

/**
 * Script de verificación rápida de marcas en Firebase
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

async function verifyBrands() {
  console.log('🔍 Verificando marcas en Firebase...')
  
  try {
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    const brandsRef = collection(db, 'brands')
    const snapshot = await getDocs(brandsRef)
    
    console.log(`📊 Total de marcas encontradas: ${snapshot.size}`)
    
    if (snapshot.empty) {
      console.log('❌ No hay marcas en Firebase')
      return
    }
    
    console.log('\n🏷️  Marcas en Firebase:')
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data()
      console.log(`${index + 1}. ${data.name} (${data.category})`)
      console.log(`   📸 Logo: ${data.logoUrl}`)
      console.log(`   🌐 Website: ${data.website}`)
      console.log(`   ✅ Activa: ${data.active}`)
      console.log(`   ⭐ Destacada: ${data.featured}`)
      console.log()
    })
    
    console.log('✅ Verificación completada!')
    
  } catch (error) {
    console.error('❌ Error verificando marcas:', error)
  }
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  verifyBrands()
}
