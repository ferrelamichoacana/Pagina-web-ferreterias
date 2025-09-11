#!/usr/bin/env npx ts-node --project tsconfig.node.json

/**
 * Script para migrar las marcas REALES desde el archivo centralizado a Firestore
 * Ejecutar: npm run migrate-brands
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { realBrands } from '../lib/data/realData'

// Usamos directamente los datos reales
const mockBrands = realBrands

// Configuración de Firebase para el script
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

async function migrateBrands() {
  console.log('🏷️  Iniciando migración de marcas a Firestore...')
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    // Verificar si ya existen marcas en Firestore
    const brandsRef = collection(db, 'brands')
    const existingBrands = await getDocs(brandsRef)
    
    if (!existingBrands.empty) {
      console.log('⚠️  Ya existen marcas en Firestore')
      console.log(`   Encontradas: ${existingBrands.size} marcas`)
    }
    
    let migrated = 0
    let skipped = 0
    
    for (const brand of mockBrands) {
      try {
        // Verificar si la marca ya existe por nombre
        const existingQuery = query(brandsRef, where('name', '==', brand.name))
        const existingDocs = await getDocs(existingQuery)
        
        if (!existingDocs.empty) {
          console.log(`⏭️  Saltando marca existente: ${brand.name}`)
          skipped++
          continue
        }
        
        // Preparar datos para Firestore
        const brandData = {
          customId: brand.id, // Mantener el ID original como campo
          name: brand.name,
          logo: brand.logo,
          category: brand.category,
          featured: brand.featured,
          active: brand.active,
          description: '', // Campo adicional para futuras descripciones
          website: '', // Campo adicional para sitio web
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        // Agregar a Firestore
        const docRef = await addDoc(brandsRef, brandData)
        console.log(`✅ Migrada: ${brand.name} (ID: ${docRef.id})`)
        migrated++
        
      } catch (error) {
        console.error(`❌ Error migrando ${brand.name}:`, error)
      }
    }
    
    console.log('\n🎉 Migración de marcas completada!')
    console.log(`   ✅ Migradas: ${migrated} marcas`)
    console.log(`   ⏭️  Saltadas: ${skipped} marcas`)
    console.log(`   📊 Total en mock: ${mockBrands.length} marcas`)
    
    // Verificar el resultado final
    const finalCount = await getDocs(brandsRef)
    console.log(`   🏷️  Total en Firestore: ${finalCount.size} marcas`)
    
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
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  }
}

// Ejecutar la migración
migrateBrands()
  .then(() => {
    console.log('\n🚀 Script de marcas completado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
