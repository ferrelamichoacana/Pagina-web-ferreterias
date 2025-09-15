require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

console.log('🔧 Variables de entorno cargadas:');
console.log('Project ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅' : '❌');
console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL ? '✅' : '❌');
console.log('Private Key:', process.env.FIREBASE_PRIVATE_KEY ? '✅' : '❌');

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

async function checkSystemConfig() {
  try {
    console.log('🔍 Verificando configuración del sistema en Firebase...');
    
    const configRef = db.collection('systemConfig').doc('general');
    const configDoc = await configRef.get();
    
    if (configDoc.exists) {
      console.log('✅ Configuración encontrada:', JSON.stringify(configDoc.data(), null, 2));
    } else {
      console.log('❌ No se encontró configuración del sistema');
      console.log('📝 Creando configuración inicial...');
      
      const initialConfig = {
        siteName: 'Ferretería La Michoacana',
        contactEmail: 'contacto@ferreterialamichoacana.com',
        supportEmail: 'soporte@ferreterialamichoacana.com',
        phone: '(443) 123-4567',
        address: 'Av. Madero #123, Centro Histórico, Morelia, Michoacán',
        maintenanceMode: false,
        allowRegistration: true,
        defaultUserRole: 'cliente',
        socialMedia: {
          facebook: 'https://facebook.com/ferreterialamichoacana',
          whatsapp: '+524431234567',
          instagram: '',
          twitter: ''
        },
        content: {
          aboutUsTitle: '¿Quiénes Somos?',
          aboutUsText: 'Somos una ferretería con más de 8 años de experiencia en el mercado, comprometidos con ofrecer productos de la más alta calidad y un servicio excepcional.',
          heroTitle: 'Ferretería La Michoacana',
          heroSubtitle: 'Tu ferretería de confianza con más de 8 años de experiencia',
          missionText: 'Proveer materiales de construcción y herramientas de la más alta calidad, con un servicio excepcional que supere las expectativas de nuestros clientes.',
          visionText: 'Ser la ferretería líder en México, reconocida por nuestra excelencia en servicio, calidad de productos y compromiso con el desarrollo de nuestras comunidades.',
          valuesText: 'Honestidad, calidad, servicio al cliente, responsabilidad social y compromiso con el crecimiento sostenible de nuestro país.'
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };
      
      await configRef.set(initialConfig);
      console.log('✅ Configuración inicial creada con éxito');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkSystemConfig();
