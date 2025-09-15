const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
require('dotenv').config({ path: '.env.local' })

// Configurar Firebase Admin
const serviceAccount = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
}

// Inicializar Firebase Admin
const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
})

const db = getFirestore(app)

async function createPromotionsCollection() {
  console.log('🎉 Creando colección de promociones...')

  try {
    // Datos de promociones de ejemplo
    const samplePromotions = [
      {
        title: 'Gran Liquidación de Herramientas',
        description: 'Descuentos de hasta 40% en herramientas eléctricas y manuales. No te pierdas esta oportunidad única.',
        imageUrl: 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fill,w_800,h_400,q_auto,f_auto/ferreteria-la-michoacana/promotions/liquidacion-herramientas',
        contactInfo: 'Visita cualquiera de nuestras sucursales o llama al 333-301-0376',
        startDate: new Date('2025-09-15'),
        endDate: new Date('2025-10-15'),
        active: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      },
      {
        title: 'Semana del Constructor',
        description: 'Precios especiales en cemento, varilla y materiales de construcción. Ideal para proyectos grandes.',
        imageUrl: 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fill,w_800,h_400,q_auto,f_auto/ferreteria-la-michoacana/promotions/semana-constructor',
        contactInfo: 'Consulta disponibilidad en sucursales. Entregas a domicilio disponibles.',
        startDate: new Date('2025-09-20'),
        endDate: new Date('2025-09-27'),
        active: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      },
      {
        title: 'Promoción Pintura y Acabados',
        description: '2x1 en pinturas seleccionadas y 15% de descuento en brochas y rodillos profesionales.',
        imageUrl: 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fill,w_800,h_400,q_auto,f_auto/ferreteria-la-michoacana/promotions/pintura-acabados',
        contactInfo: 'Aplica para compras mayores a $500. Válido en todas las sucursales.',
        startDate: new Date('2025-09-10'),
        endDate: new Date('2025-10-05'),
        active: true,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      }
    ]

    // Crear documentos en la colección
    for (const promotion of samplePromotions) {
      const docRef = await db.collection('promotions').add(promotion)
      console.log(`✅ Promoción creada: ${promotion.title} (ID: ${docRef.id})`)
    }

    console.log('🎊 ¡Colección de promociones creada exitosamente!')
    console.log(`📊 Se crearon ${samplePromotions.length} promociones de ejemplo`)

  } catch (error) {
    console.error('❌ Error creando colección de promociones:', error)
    throw error
  }
}

async function createNewsCollection() {
  console.log('📰 Actualizando colección de noticias...')

  try {
    // Datos de noticias de ejemplo (sin promociones)
    const sampleNews = [
      {
        title: 'Nueva Sucursal en Guadalajara Centro',
        description: 'Estamos emocionados de anunciar la apertura de nuestra nueva sucursal en el corazón de Guadalajara.',
        imageUrl: 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fill,w_600,h_400,q_auto,f_auto/ferreteria-la-michoacana/news/nueva-sucursal-gdl',
        link: '/sucursales',
        featured: true,
        date: new Date('2025-09-12'),
        active: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      },
      {
        title: 'Certificación ISO 9001 Obtenida',
        description: 'Ferretería La Michoacana ha obtenido la certificación ISO 9001, reforzando nuestro compromiso con la calidad.',
        imageUrl: 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fill,w_600,h_400,q_auto,f_auto/ferreteria-la-michoacana/news/iso-certificacion',
        featured: false,
        date: new Date('2025-09-08'),
        active: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      },
      {
        title: 'Programa de Capacitación para Constructores',
        description: 'Lanzamos nuestro programa gratuito de capacitación en técnicas de construcción y uso seguro de herramientas.',
        imageUrl: 'https://res.cloudinary.com/dino-cloudinary/image/upload/c_fill,w_600,h_400,q_auto,f_auto/ferreteria-la-michoacana/news/programa-capacitacion',
        link: '/empleos',
        featured: false,
        date: new Date('2025-09-05'),
        active: true,
        order: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      }
    ]

    // Crear documentos en la colección
    for (const news of sampleNews) {
      const docRef = await db.collection('news').add(news)
      console.log(`✅ Noticia creada: ${news.title} (ID: ${docRef.id})`)
    }

    console.log('📰 ¡Colección de noticias actualizada exitosamente!')
    console.log(`📊 Se crearon ${sampleNews.length} noticias de ejemplo`)

  } catch (error) {
    console.error('❌ Error actualizando colección de noticias:', error)
    throw error
  }
}

async function main() {
  console.log('🚀 Iniciando configuración de promociones y noticias...')
  console.log('=' .repeat(60))

  try {
    await createPromotionsCollection()
    console.log('')
    await createNewsCollection()
    
    console.log('')
    console.log('=' .repeat(60))
    console.log('✅ ¡Configuración completada exitosamente!')
    console.log('')
    console.log('📋 Próximos pasos:')
    console.log('   1. Las promociones aparecerán en el carousel del home')
    console.log('   2. Las noticias se mostrarán en la sección de noticias')
    console.log('   3. Ambas pueden editarse desde el panel de admin')
    console.log('   4. Ejecuta: npm run dev para ver los cambios')

  } catch (error) {
    console.error('❌ Error en la configuración:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Ejecutar
main()