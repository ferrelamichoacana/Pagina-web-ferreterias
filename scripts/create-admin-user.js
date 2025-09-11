#!/usr/bin/env node

/**
 * Script para crear el primer usuario administrador
 * Ejecutar: npm run create-admin
 */

const admin = require('firebase-admin')

// Datos del administrador inicial
const ADMIN_USER = {
  email: 'admin@ferreterialamichoacana.com',
  password: 'AdminFerreteria2025!',
  displayName: 'Administrador',
  role: 'admin'
}

async function createAdminUser() {
  console.log('👤 Creando usuario administrador inicial...')
  
  try {
    // Verificar si Firebase Admin ya está inicializado
    let app
    try {
      app = admin.app()
    } catch (error) {
      // Inicializar Firebase Admin con credenciales del proyecto
      const serviceAccount = {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      }

      if (!serviceAccount.projectId) {
        console.error('❌ Variables de entorno de Firebase no configuradas')
        console.log('   Configura las siguientes variables:')
        console.log('   - NEXT_PUBLIC_FIREBASE_PROJECT_ID')
        console.log('   - FIREBASE_CLIENT_EMAIL')
        console.log('   - FIREBASE_PRIVATE_KEY')
        process.exit(1)
      }

      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
      })
    }

    const auth = admin.auth()
    const db = admin.firestore()
    
    // Verificar si el usuario ya existe
    try {
      const existingUser = await auth.getUserByEmail(ADMIN_USER.email)
      console.log('⚠️  El usuario administrador ya existe')
      console.log(`   UID: ${existingUser.uid}`)
      console.log(`   Email: ${existingUser.email}`)
      
      // Verificar/actualizar los datos en Firestore
      const userDoc = db.collection('users').doc(existingUser.uid)
      const userSnapshot = await userDoc.get()
      
      if (!userSnapshot.exists) {
        console.log('📝 Creando documento de usuario en Firestore...')
        await userDoc.set({
          uid: existingUser.uid,
          email: existingUser.email,
          displayName: ADMIN_USER.displayName,
          role: ADMIN_USER.role,
          active: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        })
        console.log('✅ Documento de usuario creado en Firestore')
      } else {
        console.log('📄 Documento de usuario ya existe en Firestore')
        const userData = userSnapshot.data()
        if (userData.role !== 'admin') {
          console.log('🔧 Actualizando rol a administrador...')
          await userDoc.update({
            role: 'admin',
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          })
          console.log('✅ Rol actualizado a administrador')
        }
      }
      
      console.log('\n🎉 Usuario administrador configurado!')
      console.log(`   📧 Email: ${ADMIN_USER.email}`)
      console.log(`   🔐 Contraseña: ${ADMIN_USER.password}`)
      
      return
    } catch (error) {
      if (error.code !== 'auth/user-not-found') {
        throw error
      }
    }
    
    // Crear nuevo usuario
    console.log('👤 Creando nuevo usuario administrador...')
    const userRecord = await auth.createUser({
      email: ADMIN_USER.email,
      password: ADMIN_USER.password,
      displayName: ADMIN_USER.displayName,
      emailVerified: true
    })
    
    console.log(`✅ Usuario creado en Firebase Auth (UID: ${userRecord.uid})`)
    
    // Crear documento en Firestore
    console.log('📝 Creando documento de usuario en Firestore...')
    await db.collection('users').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: ADMIN_USER.displayName,
      role: ADMIN_USER.role,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })
    
    console.log('✅ Documento de usuario creado en Firestore')
    
    console.log('\n🎉 Usuario administrador creado exitosamente!')
    console.log(`   📧 Email: ${ADMIN_USER.email}`)
    console.log(`   🔐 Contraseña: ${ADMIN_USER.password}`)
    console.log(`   UID: ${userRecord.uid}`)
    
    console.log('\n📋 Próximos pasos:')
    console.log('   1. Ve a http://localhost:3000/auth/login')
    console.log('   2. Inicia sesión con las credenciales mostradas')
    console.log('   3. Serás redirigido al dashboard de administrador')
    
    // Cerrar la conexión
    await app.delete()
    
  } catch (error) {
    console.error('❌ Error durante la creación del administrador:', error)
    process.exit(1)
  }
}

// Ejecutar la creación
createAdminUser()
  .then(() => {
    console.log('\n🚀 Script completado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Error fatal:', error)
    process.exit(1)
  })
