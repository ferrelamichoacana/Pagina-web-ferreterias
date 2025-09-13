#!/usr/bin/env node

/**
 * Script para verificar que todas las variables de entorno requeridas estén configuradas
 * antes del build de producción
 */

// Cargar variables de entorno desde .env.local
try {
  require('dotenv').config({ path: '.env.local' })
} catch (error) {
  console.warn('dotenv no está disponible, continuando sin cargar .env.local')
}

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
]

const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

if (missingVars.length > 0) {
  console.warn('⚠️  ADVERTENCIA: Variables de entorno faltantes para Firebase:')
  missingVars.forEach(varName => {
    console.warn(`   - ${varName}`)
  })
  console.warn('')
  console.warn('🔧 La aplicación usará configuración dummy para el build.')
  console.warn('📋 Asegúrate de configurar estas variables en Vercel para producción.')
  console.warn('')
  
  // Establecer variables dummy para el build
  missingVars.forEach(varName => {
    switch(varName) {
      case 'NEXT_PUBLIC_FIREBASE_API_KEY':
        process.env[varName] = 'AIzaSyDummy-API-Key-For-Build-Process-Only'
        break
      case 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN':
        process.env[varName] = 'dummy-project.firebaseapp.com'
        break
      case 'NEXT_PUBLIC_FIREBASE_PROJECT_ID':
        process.env[varName] = 'dummy-project-id'
        break
      case 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET':
        process.env[varName] = 'dummy-project.appspot.com'
        break
      case 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID':
        process.env[varName] = '123456789012'
        break
      case 'NEXT_PUBLIC_FIREBASE_APP_ID':
        process.env[varName] = '1:123456789012:web:dummy-app-id'
        break
    }
  })
} else {
  console.log('✅ Todas las variables de entorno de Firebase están configuradas')
}
