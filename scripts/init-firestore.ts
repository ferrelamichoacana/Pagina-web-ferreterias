// Script para inicializar Firestore con la estructura de colecciones
// Ejecutar con: npx ts-node scripts/init-firestore.ts

import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { realBranches, realBrands } from '../lib/data/realData'

// Configuración de Firebase Admin usando el archivo JSON
const serviceAccount = require('../website-ferreteria-firebase-adminsdk-fbsvc-928ca1763f.json')

const adminConfig = {
  credential: cert(serviceAccount),
}

// Inicializar Firebase Admin
const app = initializeApp(adminConfig, 'init-script')
const db = getFirestore(app)

async function initializeFirestore() {
  console.log('🔥 Inicializando estructura de Firestore...')

  try {
    // 1. Crear colección de sucursales
    console.log('📍 Creando sucursales...')
    for (const branch of realBranches) {
      await db.collection('branches').doc(branch.id).set({
        ...branch,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    console.log(`✅ ${realBranches.length} sucursales creadas`)

    // 2. Crear usuarios de ejemplo
    console.log('👥 Creando usuarios de ejemplo...')
    const users = [
      {
        uid: 'admin-user-1',
        email: 'administrador@ferrelamichoacana.com',
        displayName: 'Administrador Principal',
        role: 'admin',
        phone: '(443) 123-4567',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uid: 'gerente-morelia-1',
        email: 'gerente.morelia@ferreterialamichoacana.com',
        displayName: 'Juan Carlos Pérez',
        role: 'gerente',
        branchId: 'morelia-centro',
        phone: '(443) 123-4568',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uid: 'vendedor-morelia-1',
        email: 'vendedor1.morelia@ferreterialamichoacana.com',
        displayName: 'María González',
        role: 'vendedor',
        branchId: 'morelia-centro',
        phone: '(443) 123-4569',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uid: 'rrhh-user-1',
        email: 'rrhh@ferreterialamichoacana.com',
        displayName: 'Ana Martínez',
        role: 'rrhh',
        phone: '(443) 123-4570',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        uid: 'it-user-1',
        email: 'it@ferreterialamichoacana.com',
        displayName: 'Carlos Rodríguez',
        role: 'it',
        phone: '(443) 123-4571',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    for (const user of users) {
      await db.collection('users').doc(user.uid).set(user)
    }
    console.log(`✅ ${users.length} usuarios de ejemplo creados`)

    // 3. Crear solicitudes de contacto de ejemplo
    console.log('📋 Creando solicitudes de contacto de ejemplo...')
    const contactRequests = [
      {
        companyName: 'Constructora del Bajío',
        contactName: 'Ing. Roberto Jiménez',
        email: 'roberto@constructoradelbajio.com',
        phone: '(443) 555-0101',
        branchId: 'morelia-centro',
        location: 'Morelia, Michoacán',
        estimatedBudget: '500k-1m',
        projectDescription: 'Construcción de conjunto habitacional de 50 casas. Necesitamos cotización para materiales de construcción: cemento, varilla, block, etc.',
        subscribeNewsletter: true,
        status: 'pendiente',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        companyName: 'Taller Mecánico Hernández',
        contactName: 'José Luis Hernández',
        email: 'jose@tallerhernandez.com',
        phone: '(452) 555-0102',
        branchId: 'uruapan',
        location: 'Uruapan, Michoacán',
        estimatedBudget: '50k-100k',
        projectDescription: 'Ampliación de taller mecánico. Necesito herramientas especializadas y equipo de soldadura.',
        subscribeNewsletter: false,
        status: 'asignada',
        assignedTo: 'vendedor-morelia-1',
        assignedBy: 'gerente-morelia-1',
        createdAt: new Date(Date.now() - 86400000), // Ayer
        updatedAt: new Date()
      }
    ]

    for (let i = 0; i < contactRequests.length; i++) {
      await db.collection('contactRequests').add(contactRequests[i])
    }
    console.log(`✅ ${contactRequests.length} solicitudes de contacto creadas`)

    // 4. Crear vacantes de empleo de ejemplo
    console.log('💼 Creando vacantes de empleo...')
    const jobPostings = [
      {
        branchId: 'morelia-centro',
        branchName: 'Sucursal Morelia Centro',
        title: 'Vendedor de Mostrador',
        description: 'Buscamos vendedor con experiencia en ferretería para atención al cliente y ventas.',
        requirements: 'Experiencia mínima 1 año en ventas, conocimiento de materiales de construcción, secundaria terminada.',
        salary: '$8,000 - $12,000',
        schedule: 'Lunes a Sábado 8:00 AM - 6:00 PM',
        benefits: 'Prestaciones de ley, comisiones por ventas, capacitación constante',
        status: 'activa',
        createdBy: 'gerente-morelia-1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        branchId: 'guadalajara',
        branchName: 'Sucursal Guadalajara',
        title: 'Auxiliar de Almacén',
        description: 'Auxiliar para manejo de inventario, recepción y despacho de mercancía.',
        requirements: 'Preparatoria terminada, experiencia en almacén, manejo de montacargas (deseable).',
        salary: '$7,000 - $9,000',
        schedule: 'Lunes a Viernes 7:00 AM - 5:00 PM',
        benefits: 'Prestaciones de ley, uniformes, herramientas de trabajo',
        status: 'activa',
        createdBy: 'gerente-morelia-1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    for (let i = 0; i < jobPostings.length; i++) {
      await db.collection('jobPostings').add(jobPostings[i])
    }
    console.log(`✅ ${jobPostings.length} vacantes de empleo creadas`)

    // 5. Crear aplicaciones de trabajo de ejemplo
    console.log('📄 Creando aplicaciones de trabajo...')
    const jobApplications = [
      {
        jobId: 'job-1', // Se actualizará con ID real
        jobTitle: 'Vendedor de Mostrador',
        branchId: 'morelia-centro',
        branchName: 'Sucursal Morelia Centro',
        applicantName: 'Pedro Ramírez',
        email: 'pedro.ramirez@email.com',
        phone: '(443) 555-0201',
        address: 'Calle Hidalgo #123',
        city: 'Morelia',
        state: 'Michoacán',
        educationLevel: 'preparatoria',
        experience: 'Trabajé 2 años en Ferretería San José como vendedor de mostrador. Conozco materiales de construcción y herramientas.',
        desiredSalary: 10000,
        availability: 'Inmediata',
        status: 'nuevo',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    for (let i = 0; i < jobApplications.length; i++) {
      await db.collection('jobApplications').add(jobApplications[i])
    }
    console.log(`✅ ${jobApplications.length} aplicaciones de trabajo creadas`)

    // 6. Crear tickets IT de ejemplo
    console.log('🔧 Creando tickets IT...')
    const itTickets = [
      {
        branchId: 'morelia-centro',
        branchName: 'Sucursal Morelia Centro',
        createdBy: 'gerente-morelia-1',
        creatorName: 'Juan Carlos Pérez',
        category: 'hardware',
        title: 'Computadora de caja no enciende',
        description: 'La computadora principal de la caja registradora no enciende desde esta mañana. Revisé cables y conexiones.',
        priority: 'alta',
        status: 'abierto',
        rustdeskCode: 'ABC123',
        rustdeskPassword: 'temp123',
        availableSchedule: 'Lunes a Viernes 9:00 AM - 5:00 PM',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    for (let i = 0; i < itTickets.length; i++) {
      await db.collection('itTickets').add(itTickets[i])
    }
    console.log(`✅ ${itTickets.length} tickets IT creados`)

    // 7. Crear marcas reales
    console.log('🏷️ Creando marcas...')
    
    for (let i = 0; i < realBrands.length; i++) {
      await db.collection('brands').add({
        ...realBrands[i],
        customId: realBrands[i].id, // Mantener ID original como campo
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
    console.log(`✅ ${realBrands.length} marcas creadas`)

    // 8. Crear configuración del sistema
    console.log('⚙️ Creando configuración del sistema...')
    await db.collection('systemConfig').doc('general').set({
      siteName: 'Ferretería La Michoacana',
      maintenanceMode: false,
      allowRegistration: true,
      defaultUserRole: 'cliente',
      contactEmail: 'contacto@ferreterialamichoacana.com',
      supportEmail: 'soporte@ferreterialamichoacana.com',
      phone: '(443) 123-4567',
      address: 'Av. Madero #123, Centro Histórico, Morelia, Michoacán',
      socialMedia: {
        facebook: 'https://facebook.com/ferreterialamichoacana',
        whatsapp: '+524431234567'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    })
    console.log('✅ Configuración del sistema creada')

    console.log('\n🎉 ¡Estructura de Firestore inicializada correctamente!')
    console.log('\n📊 Resumen:')
    console.log(`- ${realBranches.length} sucursales`)
    console.log(`- ${users.length} usuarios de ejemplo`)
    console.log(`- ${contactRequests.length} solicitudes de contacto`)
    console.log(`- ${jobPostings.length} vacantes de empleo`)
    console.log(`- ${jobApplications.length} aplicaciones de trabajo`)
    console.log(`- ${itTickets.length} tickets IT`)
    console.log(`- ${realBrands.length} marcas`)
    console.log('- 1 configuración del sistema')

    console.log('\n🔐 Usuarios de prueba creados:')
    users.forEach(user => {
      console.log(`- ${user.role}: ${user.email}`)
    })

    console.log('\n⚠️  IMPORTANTE:')
    console.log('1. Ve a Firebase Console > Authentication')
    console.log('2. Crea manualmente las cuentas de usuario con las emails de arriba')
    console.log('3. Usa contraseñas temporales como "password123"')
    console.log('4. Los usuarios podrán cambiar sus contraseñas después')

  } catch (error) {
    console.error('❌ Error inicializando Firestore:', error)
  }
}

// Ejecutar script
initializeFirestore().then(() => {
  console.log('\n✅ Script completado')
  process.exit(0)
}).catch((error) => {
  console.error('❌ Error ejecutando script:', error)
  process.exit(1)
})

/*
 * INSTRUCCIONES DE USO:
 * 
 * 1. Asegúrate de tener las variables de entorno configuradas
 * 2. Instala ts-node: npm install -g ts-node
 * 3. Ejecuta: npx ts-node scripts/init-firestore.ts
 * 
 * NOTA: Este script solo se ejecuta UNA VEZ para inicializar la base de datos
 */