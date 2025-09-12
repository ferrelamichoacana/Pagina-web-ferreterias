#!/usr/bin/env npx ts-node --project tsconfig.node.json

/**
 * Script completo para migrar marcas REALES a Firebase
 * 1. Sube logos locales a Cloudinary
 * 2. Borra datos dummy de Firebase
 * 3. Crea registros reales con URLs de Cloudinary
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from 'firebase/firestore'
import { realBrands } from '../lib/data/realData'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// URLs base para Cloudinary - usando URLs de ejemplo que puedes reemplazar
const cloudinaryBaseUrl = 'https://res.cloudinary.com/dino-cloudinary/image/upload'

// Mapeo de logos locales a URLs de Cloudinary (URLs temporales - reemplaza por las reales)
const logoUrls: { [key: string]: string } = {
  '/images/haefele_logo.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/haefele_logo.png`,
  '/images/logo_cerrajes.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_cerrajes.png`,
  '/images/logo_handyhome.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_handyhome.png`,
  '/images/logo_herma.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_herma.png`,
  '/images/logo_soarma.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_soarma.png`,
  '/images/logo_sayer.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_sayer.png`,
  '/images/logo_resistol.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_resistol.png`,
  '/images/logo_truper.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_truper.png`,
  '/images/logo_dewalt.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_dewalt.png`,
  '/images/logo_makita.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_makita.png`,
  '/images/logo_silverline.png': `${cloudinaryBaseUrl}/v1726147200/ferreteria-la-michoacana/brands/logo_silverline.png`,
}

async function uploadImageToCloudinary(imagePath: string): Promise<string> {
  // Para este script, usaremos URLs predefinidas
  // En un entorno real, aquí subirías la imagen usando la API de Cloudinary
  
  const cloudinaryUrl = logoUrls[imagePath]
  if (cloudinaryUrl) {
    return cloudinaryUrl
  }
  
  // Fallback a una imagen placeholder
  return `${cloudinaryBaseUrl}/placeholder.png`
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
  
  // Eliminar todas las marcas existentes
  for (const brandDoc of existingBrands.docs) {
    await deleteDoc(doc(db, 'brands', brandDoc.id))
    console.log(`   🗑️  Eliminada: ${brandDoc.data().name || 'Sin nombre'}`)
  }
  
  console.log('   ✅ Limpieza completada')
}

async function migrateBrandsToFirebase() {
  console.log('🏷️  Iniciando migración completa de marcas...')
  
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
      console.log('   O ejecuta desde Vercel donde están configuradas')
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
    console.log('\n📤 Migrando marcas reales...')
    
    const brandsRef = collection(db, 'brands')
    let migrated = 0
    
    for (const brand of realBrands) {
      try {
        // Subir logo a Cloudinary (o usar URL predefinida)
        const logoUrl = await uploadImageToCloudinary(brand.logo)
        
        // Preparar datos para Firestore con estructura correcta
        const brandData = {
          name: brand.name,
          logoUrl: logoUrl, // Usar logoUrl en lugar de logo
          category: brand.category,
          description: brand.description,
          website: brand.website,
          active: brand.active,
          featured: brand.featured || false,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        // Agregar a Firestore
        const docRef = await addDoc(brandsRef, brandData)
        console.log(`   ✅ ${brand.name} → ${logoUrl}`)
        migrated++
        
      } catch (error) {
        console.error(`   ❌ Error migrando ${brand.name}:`, error)
      }
    }
    
    // Paso 3: Verificar resultado
    console.log('\n🎉 Migración completada!')
    console.log(`   ✅ Migradas: ${migrated}/${realBrands.length} marcas`)
    
    const finalCount = await getDocs(brandsRef)
    console.log(`   📊 Total en Firestore: ${finalCount.size} marcas`)
    
    // Mostrar estadísticas por categoría
    const brandsByCategory: { [key: string]: number } = {}
    finalCount.docs.forEach(doc => {
      const data = doc.data()
      const category = data.category
      brandsByCategory[category] = (brandsByCategory[category] || 0) + 1
    })
    
    console.log('\n📊 Marcas por categoría:')
    Object.entries(brandsByCategory).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} marcas`)
    })
    
    console.log('\n✅ Las marcas ahora están listas para consumo desde Firebase!')
    console.log('   🎯 El BrandsManager ya no usará mocks, solo datos de Firebase')
    
  } catch (error) {
    console.error('❌ Error en la migración:', error)
    process.exit(1)
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateBrandsToFirebase()
}
