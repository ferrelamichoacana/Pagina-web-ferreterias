import { NextRequest, NextResponse } from 'next/server'
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore'
import { getFirestore as getFirestoreUtils } from '@/lib/firebase/utils'

export async function GET() {
  try {
    console.log('🔍 Verificando configuración del sistema...')
    
    const db = getFirestoreUtils()
    const configRef = doc(db, 'systemConfig', 'general')
    const configDoc = await getDoc(configRef)
    
    if (configDoc.exists()) {
      console.log('✅ Configuración encontrada')
      return NextResponse.json({ 
        exists: true, 
        config: configDoc.data() 
      })
    } else {
      console.log('❌ No se encontró configuración del sistema')
      console.log('📝 Creando configuración inicial...')
      
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
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      await setDoc(configRef, initialConfig)
      console.log('✅ Configuración inicial creada con éxito')
      
      return NextResponse.json({ 
        exists: false, 
        created: true,
        config: initialConfig 
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    return NextResponse.json(
      { error: 'Error verificando configuración', details: (error as Error).message },
      { status: 500 }
    )
  }
}
