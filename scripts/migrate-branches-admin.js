#!/usr/bin/env node

/**
 * Script para migrar las sucursales usando Firebase Admin SDK
 * Ejecutar: npm run migrate-branches-admin
 */

const admin = require('firebase-admin')

// Datos de sucursales
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

async function migrateBranches() {
  console.log('🔥 Iniciando migración de sucursales a Firestore (Admin SDK)...')
  
  try {
    // Verificar si Firebase Admin ya está inicializado
    let app
    try {
      app = admin.app()
    } catch (error) {
      // Inicializar Firebase Admin
      const serviceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }

      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      })
    }

    const db = admin.firestore()
    
    // Verificar si ya existen sucursales en Firestore
    const branchesRef = db.collection('branches')
    const existingBranches = await branchesRef.get()
    
    if (!existingBranches.empty) {
      console.log('⚠️  Ya existen sucursales en Firestore')
      console.log(`   Encontradas: ${existingBranches.size} sucursales`)
    }
    
    let migrated = 0
    let skipped = 0
    
    for (const branch of branches) {
      try {
        // Verificar si la sucursal ya existe por customId
        const existingQuery = await branchesRef.where('customId', '==', branch.id).get()
        
        if (!existingQuery.empty) {
          console.log(`⏭️  Saltando sucursal existente: ${branch.name}`)
          skipped++
          continue
        }
        
        // Preparar datos para Firestore
        const branchData = {
          customId: branch.id,
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
          active: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }
        
        // Agregar a Firestore
        const docRef = await branchesRef.add(branchData)
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
    const finalCount = await branchesRef.get()
    console.log(`   🔥 Total en Firestore: ${finalCount.size} sucursales`)
    
    // Cerrar la conexión
    await app.delete()
    
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
