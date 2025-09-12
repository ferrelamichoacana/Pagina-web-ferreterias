#!/usr/bin/env npx ts-node --project tsconfig.node.json

/**
 * Script temporal: migra marcas con URLs locales como fallback
 * Esto permitirá que funcione inmediatamente mientras subes las imágenes a Cloudinary
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { realBrands } from '../lib/data/realData'
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

// URLs locales como fallback (para funcionar inmediatamente)
const localUrls: { [key: string]: string } = {
  '/images/brands/haefele_logo.png': '/images/haefele_logo.png',
  '/images/brands/logo_cerrajes.png': '/images/logo_cerrajes.png',
  '/images/brands/logo_dewalt.png': '/images/logo_dewalt.png',
  '/images/brands/logo_handyhome.png': '/images/logo_handyhome.png',
  '/images/brands/logo_herma.png': '/images/logo_herma.png',
  '/images/brands/logo_makita.png': '/images/logo_makita.png',
  '/images/brands/logo_resistol.png': '/images/logo_resistol.png',
  '/images/brands/logo_sayer.png': '/images/logo_sayer.png',
  '/images/brands/logo_silverline.png': '/images/logo_silverline.png',
  '/images/brands/logo_soarma.png': '/images/logo_soarma.png',
  '/images/brands/logo_truper.png': '/images/logo_truper.png',
  '/images/brands/logo_blackdecker.png': '/images/placeholder.png', // No existe
  '/images/brands/logo_stanley.png': '/images/placeholder.png', // No existe
}

// URLs de Cloudinary (para cuando subas las imágenes)
const cloudinaryUrls: { [key: string]: string } = {
  '/images/brands/haefele_logo.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/hafele',
  '/images/brands/logo_cerrajes.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/cerrajes',
  '/images/brands/logo_dewalt.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/dewalt',
  '/images/brands/logo_handyhome.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/handyhome',
  '/images/brands/logo_herma.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/herma',
  '/images/brands/logo_makita.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/makita',
  '/images/brands/logo_resistol.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/resistol',
  '/images/brands/logo_sayer.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/sayer',
  '/images/brands/logo_silverline.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/silverline',
  '/images/brands/logo_soarma.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/soarma',
  '/images/brands/logo_truper.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/truper',
  '/images/brands/logo_blackdecker.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/blackdecker',
  '/images/brands/logo_stanley.png': 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fit,h_200,w_200,f_auto,q_auto/ferreteria-la-michoacana/brands/stanley',
}

async function getImageUrl(imagePath: string, useCloudinary: boolean = false): Promise<string> {
  if (useCloudinary && cloudinaryUrls[imagePath]) {
    return cloudinaryUrls[imagePath]
  }
  
  // Usar URLs locales como fallback
  return localUrls[imagePath] || '/images/placeholder.png'
}

async function clearExistingBrands(db: any) {
  console.log('🗑️  Limpiando marcas existentes en Firebase...')
  
  const brandsRef = collection(db, 'brands')
  const existingBrands = await getDocs(brandsRef)
  
  if (existingBrands.empty) {
    console.log('   ✅ No hay marcas existentes para limpiar')
    return
  }
  
  console.log(`   📊 Encontradas ${existingBrands.size} marcas para eliminar`)
  
  for (const brandDoc of existingBrands.docs) {
    await deleteDoc(doc(db, 'brands', brandDoc.id))
    console.log(`   🗑️  Eliminada: ${brandDoc.data().name || 'Sin nombre'}`)
  }
  
  console.log('   ✅ Limpieza completada')
}

async function migrateBrandsWithLocalImages() {
  console.log('🏷️  Migrando marcas con imágenes locales (temporal)...')
  console.log('📌 Nota: Usa URLs locales hasta que subas las imágenes a Cloudinary')
  
  try {
    // Verificar variables de entorno
    console.log('🔍 Verificando configuración de Firebase...')
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID'
    ]
    
    const missingVars = requiredVars.filter(varName => !process.env[varName])
    if (missingVars.length > 0) {
      console.error('❌ Variables de entorno faltantes:', missingVars)
      console.log('   Crea un archivo .env.local con las variables de Firebase')
      process.exit(1)
    }
    
    console.log('   ✅ Variables de Firebase encontradas')
    console.log(`   📋 Proyecto ID: ${firebaseConfig.projectId}`)
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    // Paso 1: Limpiar marcas existentes
    await clearExistingBrands(db)
    
    // Paso 2: Migrar marcas reales
    console.log('\n📤 Migrando marcas reales con URLs locales...')
    
    const brandsRef = collection(db, 'brands')
    let migrated = 0
    
    for (const brand of realBrands) {
      try {
        // Usar imagen local temporalmente
        const logoUrl = await getImageUrl(brand.logo, false) // false = usar local
        
        const brandData = {
          name: brand.name,
          logoUrl: logoUrl,
          category: brand.category,
          description: brand.description,
          website: brand.website,
          active: brand.active,
          featured: brand.featured || false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        await addDoc(brandsRef, brandData)
        console.log(`   ✅ ${brand.name} → ${logoUrl}`)
        migrated++
        
      } catch (error) {
        console.error(`   ❌ Error migrando ${brand.name}:`, error)
      }
    }
    
    // Paso 3: Verificar resultado
    console.log('\n🎉 Migración completada!')
    console.log(`   ✅ Migradas: ${migrated}/${realBrands.length} marcas`)
    
    console.log('\n📋 Próximos pasos:')
    console.log('   1. Configura CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en .env.local')
    console.log('   2. Ejecuta: ./scripts/upload-to-cloudinary.sh')
    console.log('   3. Ejecuta: npm run migrate-brands-complete (para URLs de Cloudinary)')
    
  } catch (error) {
    console.error('❌ Error en la migración:', error)
    process.exit(1)
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateBrandsWithLocalImages()
}
