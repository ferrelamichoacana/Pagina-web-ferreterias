#!/usr/bin/env ts-node

import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Cargar variables de entorno
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

interface IndexField {
  fieldPath: string
  order?: 'ASCENDING' | 'DESCENDING'
  arrayConfig?: 'CONTAINS'
}

interface CompositeIndex {
  collectionGroup: string
  fields: IndexField[]
  queryScope?: 'COLLECTION' | 'COLLECTION_GROUP'
}

// Definir todos los índices necesarios basados en las consultas encontradas
const REQUIRED_INDEXES: CompositeIndex[] = [
  // 1. NEWS COLLECTION - El índice que está causando el error
  {
    collectionGroup: 'news',
    fields: [
      { fieldPath: 'active', order: 'ASCENDING' },
      { fieldPath: 'order', order: 'ASCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  // 2. NEWS COLLECTION - Variaciones adicionales para noticias
  {
    collectionGroup: 'news',
    fields: [
      { fieldPath: 'active', order: 'ASCENDING' },
      { fieldPath: 'date', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'news',
    fields: [
      { fieldPath: 'active', order: 'ASCENDING' },
      { fieldPath: 'featured', order: 'ASCENDING' },
      { fieldPath: 'date', order: 'DESCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'news',
    fields: [
      { fieldPath: 'active', order: 'ASCENDING' },
      { fieldPath: 'type', order: 'ASCENDING' },
      { fieldPath: 'date', order: 'DESCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'news',
    fields: [
      { fieldPath: 'featured', order: 'ASCENDING' },
      { fieldPath: 'date', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'news',
    fields: [
      { fieldPath: 'type', order: 'ASCENDING' },
      { fieldPath: 'date', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },

  // 3. BRANCHES COLLECTION
  {
    collectionGroup: 'branches',
    fields: [
      { fieldPath: 'active', order: 'ASCENDING' },
      { fieldPath: 'name', order: 'ASCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },

  // 4. BRANDS COLLECTION
  {
    collectionGroup: 'brands',
    fields: [
      { fieldPath: 'active', order: 'ASCENDING' },
      { fieldPath: 'name', order: 'ASCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },

  // 5. JOB APPLICATIONS COLLECTION
  {
    collectionGroup: 'job-applications',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'job-applications',
    fields: [
      { fieldPath: 'branchId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'job-applications',
    fields: [
      { fieldPath: 'assignedTo', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },

  // 6. QUOTATIONS COLLECTION
  {
    collectionGroup: 'quotations',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'quotations',
    fields: [
      { fieldPath: 'branchId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },

  // 7. CONTACT REQUESTS COLLECTION
  {
    collectionGroup: 'contact-requests',
    fields: [
      { fieldPath: 'email', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'contact-requests',
    fields: [
      { fieldPath: 'userId', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'contact-requests',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },

  // 8. FILES COLLECTION
  {
    collectionGroup: 'files',
    fields: [
      { fieldPath: 'uploadedBy', order: 'ASCENDING' },
      { fieldPath: 'uploadedAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'files',
    fields: [
      { fieldPath: 'relatedTo', order: 'ASCENDING' },
      { fieldPath: 'uploadedAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'files',
    fields: [
      { fieldPath: 'relatedType', order: 'ASCENDING' },
      { fieldPath: 'uploadedAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  },
  
  {
    collectionGroup: 'files',
    fields: [
      { fieldPath: 'category', order: 'ASCENDING' },
      { fieldPath: 'uploadedAt', order: 'DESCENDING' },
      { fieldPath: '__name__', order: 'ASCENDING' }
    ],
    queryScope: 'COLLECTION'
  }
]

/**
 * Inicializa Firebase Admin SDK
 */
function initializeFirebaseAdmin() {
  console.log('🔥 Inicializando Firebase Admin SDK...')
  
  try {
    // Verificar si ya está inicializado
    if (admin.apps.length > 0) {
      console.log('✅ Firebase Admin SDK ya está inicializado')
      return admin.app()
    }

    // Obtener credenciales del service account
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'website-ferreteria'

    if (!serviceAccountKey) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY no está configurado en las variables de entorno')
    }

    let serviceAccount
    try {
      serviceAccount = JSON.parse(serviceAccountKey)
    } catch (error) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY no es un JSON válido')
    }

    // Inicializar con las credenciales
    const app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: projectId
    })

    console.log(`✅ Firebase Admin SDK inicializado para proyecto: ${projectId}`)
    return app

  } catch (error) {
    console.error('❌ Error inicializando Firebase Admin SDK:', error)
    throw error
  }
}

/**
 * Genera el comando gcloud para crear un índice
 */
function generateGcloudCommand(index: CompositeIndex): string {
  const fields = index.fields.map(field => {
    if (field.fieldPath === '__name__') {
      return '__name__'
    }
    return `${field.fieldPath}:${field.order?.toLowerCase() || 'ascending'}`
  }).join(',')

  return `gcloud firestore indexes composite create --collection-group=${index.collectionGroup} --field-config=${fields}`
}

/**
 * Genera la URL de Firebase Console para crear el índice
 */
function generateFirebaseConsoleUrl(index: CompositeIndex, projectId: string): string {
  // Codificar los campos del índice para la URL
  const fieldParams = index.fields.map(field => {
    const order = field.fieldPath === '__name__' ? 'ASCENDING' : (field.order || 'ASCENDING')
    return `${field.fieldPath}:${order}`
  }).join(',')
  
  return `https://console.firebase.google.com/u/0/project/${projectId}/firestore/indexes?create_composite=${index.collectionGroup}:${fieldParams}`
}

/**
 * Función principal para crear índices
 */
async function createFirestoreIndexes() {
  console.log('🚀 Iniciando creación de índices de Firestore...\n')

  try {
    // Inicializar Firebase Admin
    const app = initializeFirebaseAdmin()
    const projectId = app.options.projectId || 'website-ferreteria'
    
    console.log(`📊 Total de índices a crear: ${REQUIRED_INDEXES.length}\n`)

    // Mostrar información sobre cada índice
    REQUIRED_INDEXES.forEach((index, i) => {
      console.log(`${i + 1}. ÍNDICE PARA COLECCIÓN: ${index.collectionGroup}`)
      console.log(`   Campos: ${index.fields.map(f => `${f.fieldPath} (${f.order || 'ASC'})`).join(', ')}`)
      console.log(`   Comando gcloud:`)
      console.log(`   ${generateGcloudCommand(index)}`)
      console.log(`   URL Firebase Console:`)
      console.log(`   ${generateFirebaseConsoleUrl(index, projectId)}`)
      console.log('')
    })

    console.log('📋 INSTRUCCIONES PARA CREAR LOS ÍNDICES:')
    console.log('==========================================')
    console.log('')
    console.log('OPCIÓN 1: Usar Firebase Console (Recomendado para principiantes)')
    console.log('----------------------------------------------------------------')
    console.log('1. Haz clic en cada URL mostrada arriba')
    console.log('2. Confirma la creación del índice en la interfaz web')
    console.log('3. Espera a que el índice se complete (puede tomar varios minutos)')
    console.log('')
    console.log('OPCIÓN 2: Usar gcloud CLI (Para usuarios avanzados)')
    console.log('----------------------------------------------------')
    console.log('1. Instala gcloud CLI: https://cloud.google.com/sdk/docs/install')
    console.log('2. Autentícate: gcloud auth login')
    console.log(`3. Configura el proyecto: gcloud config set project ${projectId}`)
    console.log('4. Ejecuta cada comando gcloud mostrado arriba')
    console.log('')
    console.log('OPCIÓN 3: Script automático (Requiere configuración adicional)')
    console.log('--------------------------------------------------------------')
    console.log('Este script puede automáticamente crear los índices si tienes:')
    console.log('- gcloud CLI instalado y configurado')
    console.log('- Permisos de Editor de Firestore en el proyecto')
    console.log('')
    
    // Preguntar si el usuario quiere intentar creación automática
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    })

    const createAutomatically = await new Promise<boolean>((resolve) => {
      readline.question('¿Quieres intentar crear los índices automáticamente con gcloud? (y/N): ', (answer: string) => {
        readline.close()
        resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
      })
    })

    if (createAutomatically) {
      await createIndexesAutomatically()
    } else {
      console.log('')
      console.log('🔧 Para resolver el error específico que estás viendo, crea este índice primero:')
      console.log('================================================================================')
      const newsIndex = REQUIRED_INDEXES.find(idx => idx.collectionGroup === 'news' && 
        idx.fields.some(f => f.fieldPath === 'active') && 
        idx.fields.some(f => f.fieldPath === 'order'))
      
      if (newsIndex) {
        console.log(`URL: ${generateFirebaseConsoleUrl(newsIndex, projectId)}`)
        console.log(`Comando: ${generateGcloudCommand(newsIndex)}`)
      }
    }

  } catch (error) {
    console.error('❌ Error en el proceso:', error)
    process.exit(1)
  }
}

/**
 * Intenta crear índices automáticamente usando gcloud
 */
async function createIndexesAutomatically() {
  const { spawn } = require('child_process')
  
  console.log('\n🤖 Intentando crear índices automáticamente...')
  
  // Verificar si gcloud está disponible
  const checkGcloud = spawn('gcloud', ['--version'], { stdio: 'pipe' })
  
  const gcloudAvailable = await new Promise<boolean>((resolve) => {
    checkGcloud.on('close', (code: number | null) => {
      resolve(code === 0)
    })
    checkGcloud.on('error', () => {
      resolve(false)
    })
  })

  if (!gcloudAvailable) {
    console.log('❌ gcloud CLI no está instalado o no está en el PATH')
    console.log('   Instálalo desde: https://cloud.google.com/sdk/docs/install')
    return
  }

  console.log('✅ gcloud CLI está disponible')

  // Crear cada índice
  for (let i = 0; i < REQUIRED_INDEXES.length; i++) {
    const index = REQUIRED_INDEXES[i]
    console.log(`\n📊 Creando índice ${i + 1}/${REQUIRED_INDEXES.length} para ${index.collectionGroup}...`)
    
    const fields = index.fields.map(field => {
      if (field.fieldPath === '__name__') {
        return '__name__'
      }
      return `${field.fieldPath}:${field.order?.toLowerCase() || 'ascending'}`
    }).join(',')

    const args = [
      'firestore', 'indexes', 'composite', 'create',
      `--collection-group=${index.collectionGroup}`,
      `--field-config=${fields}`,
      '--quiet'
    ]

    const createProcess = spawn('gcloud', args, { stdio: 'pipe' })
    
    const success = await new Promise<boolean>((resolve) => {
      let output = ''
      let error = ''
      
      createProcess.stdout.on('data', (data: Buffer) => {
        output += data.toString()
      })
      
      createProcess.stderr.on('data', (data: Buffer) => {
        error += data.toString()
      })
      
      createProcess.on('close', (code: number | null) => {
        if (code === 0) {
          console.log(`   ✅ Índice creado exitosamente`)
          resolve(true)
        } else {
          console.log(`   ⚠️ Error creando índice: ${error}`)
          resolve(false)
        }
      })
    })

    if (!success) {
      console.log('   💡 Puedes crear este índice manualmente usando Firebase Console')
    }
  }

  console.log('\n🎉 Proceso de creación automática completado!')
  console.log('   Los índices pueden tomar varios minutos en estar listos.')
  console.log('   Verifica el estado en Firebase Console.')
}

// Verificar que se está ejecutando directamente
if (require.main === module) {
  createFirestoreIndexes().catch(error => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
}

export { createFirestoreIndexes, REQUIRED_INDEXES }
