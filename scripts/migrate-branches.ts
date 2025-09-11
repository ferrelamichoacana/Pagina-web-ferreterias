#!/usr/bin/env npx ts-node --project tsconfig.node.json

/**
 * Script para migrar las sucursales desde el archivo estático a Firestore
 * Ejecutar: npm run migrate-branches
 */

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore'

// Importar directamente los datos de sucursales
const branches = [
  {
    id: 'puente',
    name: 'Sucursal Puente',
    city: 'Morelia',
    state: 'Michoacán',
    address: 'Av. Puente #123, Col. Puente',
    phone: '(443) 123-4567',
    email: 'puente@ferreterialamichoacana.com',
    schedule: 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00, Dom: 9:00-15:00',
    coordinates: { lat: 19.7026, lng: -101.1947 },
    isMain: true,
    managerId: null,
    services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio', 'Asesoría técnica']
  },
  {
    id: 'santa-barbara',
    name: 'Sucursal Santa Barbara',
    city: 'Morelia',
    state: 'Michoacán',
    address: 'Av. Santa Barbara #456, Col. Santa Barbara',
    phone: '(443) 234-5678',
    email: 'santabarbara@ferreterialamichoacana.com',
    schedule: 'Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00',
    coordinates: { lat: 19.6888, lng: -101.1844 },
    isMain: false,
    managerId: null,
    services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio']
  }
]

// Configuración de Firebase para el script
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

async function migrateBranches() {
  console.log('🔥 Iniciando migración de sucursales a Firestore...')
  
  try {
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    
    // Verificar si ya existen sucursales en Firestore
    const branchesRef = collection(db, 'branches')
    const existingBranches = await getDocs(branchesRef)
    
    if (!existingBranches.empty) {
      console.log('⚠️  Ya existen sucursales en Firestore')
      console.log(`   Encontradas: ${existingBranches.size} sucursales`)
      console.log('   ¿Deseas continuar? Esto creará duplicados.')
      
      // En un entorno real, aquí podrías usar readline para confirmar
      // Por ahora, continuamos pero verificamos duplicados por ID
    }
    
    let migrated = 0
    let skipped = 0
    
    for (const branch of branches) {
      try {
        // Verificar si la sucursal ya existe por ID personalizado
        const existingQuery = query(branchesRef, where('customId', '==', branch.id))
        const existingDocs = await getDocs(existingQuery)
        
        if (!existingDocs.empty) {
          console.log(`⏭️  Saltando sucursal existente: ${branch.name}`)
          skipped++
          continue
        }
        
        // Preparar datos para Firestore
        const branchData = {
          customId: branch.id, // Mantener el ID original como campo
          name: branch.name,
          city: branch.city,
          state: branch.state,
          address: branch.address,
          phone: branch.phone,
          email: branch.email,
          schedule: branch.schedule,
          coordinates: branch.coordinates,
          isMain: branch.isMain,
          managerId: branch.managerId,
          services: branch.services,
          active: true, // Campo adicional para control
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        // Agregar a Firestore
        const docRef = await addDoc(branchesRef, branchData)
        console.log(`✅ Migrada: ${branch.name} (ID: ${docRef.id})`)
        migrated++
        
      } catch (error) {
        console.error(`❌ Error migrando ${branch.name}:`, error)
      }
    }
    
    console.log('\n🎉 Migración completada!')
    console.log(`   ✅ Migradas: ${migrated} sucursales`)
    console.log(`   ⏭️  Saltadas: ${skipped} sucursales`)
    console.log(`   📊 Total en archivo: ${branches.length} sucursales`)
    
    // Verificar el resultado final
    const finalCount = await getDocs(branchesRef)
    console.log(`   🔥 Total en Firestore: ${finalCount.size} sucursales`)
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error)
    process.exit(1)
  }
}

// Ejecutar la migración
migrateBranches()
  .then(() => {
    console.log('\n🚀 Script completado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
