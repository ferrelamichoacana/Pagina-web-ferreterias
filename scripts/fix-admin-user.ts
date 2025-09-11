import { initializeApp } from 'firebase/app'
import { getFirestore, doc, updateDoc } from 'firebase/firestore'

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCkOKGb7HQBxDZggERqO9YCcJF6Xtv48tA",
  authDomain: "website-ferreteria.firebaseapp.com",
  projectId: "website-ferreteria",
  storageBucket: "website-ferreteria.firebasestorage.app",
  messagingSenderId: "98543952889",
  appId: "1:98543952889:web:848152f63254df7e205328"
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function fixAdminUser() {
  try {
    // UID del usuario administrador
    const adminUID = "p8ydJNXqeWTDOTMcVOZAHnoDaUJ3"
    
    // Actualizar el rol a admin
    await updateDoc(doc(db, 'users', adminUID), {
      role: 'admin',
      displayName: 'Administrador',
      updatedAt: new Date()
    })
    
    console.log('✅ Usuario administrador actualizado correctamente')
    console.log('Email: administrador@ferrelamichoacana.com')
    console.log('Rol: admin')
    
  } catch (error) {
    console.error('❌ Error actualizando usuario:', error)
  }
}

// Ejecutar la función
fixAdminUser()