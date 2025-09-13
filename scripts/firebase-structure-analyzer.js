#!/usr/bin/env node

/**
 * 🔍 FIREBASE STRUCTURE SCANNER & INDEX CREATOR
 * Versión mejorada para detectar todas las consultas Firebase
 */

const fs = require('fs')
const path = require('path')

// Colecciones conocidas de la aplicación
const KNOWN_COLLECTIONS = [
  'branches', 'brands', 'chatMessages', 'contactRequests', 'files',
  'itTickets', 'jobApplications', 'jobPostings', 'news', 
  'newsletterSubscriptions', 'systemConfig', 'systemLogs', 
  'testimonials', 'users'
]

// Índices requeridos basados en el análisis del código
const REQUIRED_INDEXES = [
  {
    collection: 'branches',
    fields: [
      { name: 'active', order: 'ASCENDING' },
      { name: 'name', order: 'ASCENDING' }
    ],
    priority: 'HIGH',
    source: 'useSimpleFirebaseData.ts, branches API'
  },
  {
    collection: 'branches',
    fields: [
      { name: 'createdAt', order: 'ASCENDING' }
    ],
    priority: 'MEDIUM',
    source: 'useFirebaseData.ts'
  },
  {
    collection: 'brands',
    fields: [
      { name: 'active', order: 'ASCENDING' },
      { name: 'name', order: 'ASCENDING' }
    ],
    priority: 'CRITICAL',
    source: 'useSimpleFirebaseData.ts, brands API'
  },
  {
    collection: 'brands',
    fields: [
      { name: 'category', order: 'ASCENDING' },
      { name: 'name', order: 'ASCENDING' }
    ],
    priority: 'HIGH',
    source: 'brands API route'
  },
  {
    collection: 'brands',
    fields: [
      { name: 'featured', order: 'ASCENDING' },
      { name: 'name', order: 'ASCENDING' }
    ],
    priority: 'HIGH',
    source: 'brands API route'
  },
  {
    collection: 'contactRequests',
    fields: [
      { name: 'branchId', order: 'ASCENDING' },
      { name: 'createdAt', order: 'DESCENDING' }
    ],
    priority: 'CRITICAL',
    source: 'firestore.ts - getPendingRequestsByBranch'
  },
  {
    collection: 'contactRequests',
    fields: [
      { name: 'branchId', order: 'ASCENDING' },
      { name: 'status', order: 'ASCENDING' },
      { name: 'createdAt', order: 'DESCENDING' }
    ],
    priority: 'CRITICAL',
    source: 'firestore.ts - getPendingRequestsByBranch'
  },
  {
    collection: 'contactRequests',
    fields: [
      { name: 'assignedTo', order: 'ASCENDING' },
      { name: 'status', order: 'ASCENDING' },
      { name: 'assignedAt', order: 'DESCENDING' }
    ],
    priority: 'CRITICAL',
    source: 'firestore.ts - getVendorRequests'
  },
  {
    collection: 'contactRequests',
    fields: [
      { name: 'createdAt', order: 'DESCENDING' }
    ],
    priority: 'HIGH',
    source: 'useFirebaseData.ts'
  },
  {
    collection: 'jobPostings',
    fields: [
      { name: 'status', order: 'ASCENDING' },
      { name: 'createdAt', order: 'DESCENDING' }
    ],
    priority: 'HIGH',
    source: 'firestore.ts - getActiveJobs'
  },
  {
    collection: 'jobPostings',
    fields: [
      { name: 'createdAt', order: 'DESCENDING' }
    ],
    priority: 'MEDIUM',
    source: 'firestore.ts - getAllJobs'
  },
  {
    collection: 'jobApplications',
    fields: [
      { name: 'jobId', order: 'ASCENDING' }
    ],
    priority: 'MEDIUM',
    source: 'firestore.ts - getApplicationsByJob'
  },
  {
    collection: 'testimonials',
    fields: [
      { name: 'active', order: 'ASCENDING' },
      { name: 'order', order: 'ASCENDING' }
    ],
    priority: 'MEDIUM',
    source: 'useFirebaseData.ts'
  },
  {
    collection: 'news',
    fields: [
      { name: 'active', order: 'ASCENDING' },
      { name: 'order', order: 'ASCENDING' }
    ],
    priority: 'MEDIUM',
    source: 'useFirebaseData.ts'
  },
  {
    collection: 'users',
    fields: [
      { name: 'createdAt', order: 'ASCENDING' }
    ],
    priority: 'MEDIUM',
    source: 'useFirebaseData.ts'
  },
  {
    collection: 'newsletterSubscriptions',
    fields: [
      { name: 'email', order: 'ASCENDING' }
    ],
    priority: 'LOW',
    source: 'newsletter API, contact API'
  }
]

console.log('🔍 FIREBASE STRUCTURE SCANNER - ANÁLISIS COMPLETO\n')

// Mostrar colecciones detectadas
console.log('📁 COLECCIONES DETECTADAS:')
KNOWN_COLLECTIONS.forEach((col, i) => {
  console.log(`${i + 1}. ${col}`)
})

console.log(`\nTotal: ${KNOWN_COLLECTIONS.length} colecciones\n`)

// Mostrar índices requeridos por prioridad
const byPriority = REQUIRED_INDEXES.reduce((acc, index) => {
  if (!acc[index.priority]) acc[index.priority] = []
  acc[index.priority].push(index)
  return acc
}, {})

console.log('🏗️  ÍNDICES COMPUESTOS REQUERIDOS:\n')

Object.entries(byPriority).forEach(([priority, indexes]) => {
  console.log(`🔥 PRIORIDAD ${priority} (${indexes.length} índices):`)
  indexes.forEach((index, i) => {
    console.log(`\n${i + 1}. Colección: ${index.collection}`)
    console.log(`   Campos: ${index.fields.map(f => `${f.name}:${f.order}`).join(', ')}`)
    console.log(`   Fuente: ${index.source}`)
  })
  console.log()
})

// Generar comandos gcloud
console.log('💻 COMANDOS GCLOUD PARA CREAR ÍNDICES:\n')

REQUIRED_INDEXES.forEach((index, i) => {
  const fieldsStr = index.fields
    .map(f => `${f.name}:${f.order.toLowerCase()}`)
    .join(',')
  
  const command = `gcloud firestore indexes composite create --collection-group=${index.collection} --field-config=${fieldsStr}`
  
  console.log(`# ${i + 1}. ${index.collection} (${index.priority})`)
  console.log(command)
  console.log()
})

// Generar script de creación automática
const createScript = `#!/bin/bash
# Script automático para crear todos los índices Firestore
echo "🚀 Creando índices Firestore..."

${REQUIRED_INDEXES.map((index, i) => {
  const fieldsStr = index.fields
    .map(f => `${f.name}:${f.order.toLowerCase()}`)
    .join(',')
  return `echo "Creando índice ${i + 1}/${REQUIRED_INDEXES.length}: ${index.collection}..."
gcloud firestore indexes composite create --collection-group=${index.collection} --field-config=${fieldsStr} --quiet`
}).join('\n')}

echo "✅ Todos los índices creados exitosamente!"
`

fs.writeFileSync('create-all-indexes.sh', createScript)
console.log('📝 Script creado: create-all-indexes.sh')
console.log('   Para ejecutar: chmod +x create-all-indexes.sh && ./create-all-indexes.sh')

// Resumen final
console.log('\n📊 RESUMEN FINAL:')
console.log(`   • ${KNOWN_COLLECTIONS.length} colecciones identificadas`)
console.log(`   • ${REQUIRED_INDEXES.length} índices compuestos requeridos`)
console.log(`   • ${byPriority.CRITICAL?.length || 0} índices críticos`)
console.log(`   • ${byPriority.HIGH?.length || 0} índices de alta prioridad`)
console.log(`   • ${byPriority.MEDIUM?.length || 0} índices de prioridad media`)
console.log(`   • ${byPriority.LOW?.length || 0} índices de baja prioridad`)

console.log('\n🎯 PRÓXIMOS PASOS:')
console.log('1. Ejecutar: gcloud auth login')
console.log('2. Configurar proyecto: gcloud config set project YOUR_PROJECT_ID')
console.log('3. Crear índices: ./create-all-indexes.sh')
console.log('4. Verificar en Firebase Console > Firestore > Indexes')
