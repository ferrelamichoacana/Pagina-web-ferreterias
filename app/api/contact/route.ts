import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { sendContactConfirmation } from '@/lib/utils/email'
import { createSystemLog } from '@/lib/utils/firestore'

// Función para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para validar teléfono mexicano
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+52|52)?[\s\-]?(\(?\d{2,3}\)?[\s\-]?)?\d{3}[\s\-]?\d{4}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export async function POST(request: NextRequest) {
  try {
    // Verificar si Firebase está disponible
    if (!db) {
      console.warn('⚠️ Firebase no está configurado correctamente')
      return NextResponse.json(
        { success: false, error: 'Servicio temporalmente no disponible' },
        { status: 503 }
      )
    }

    const body = await request.json()
    
    // Validar campos requeridos
    const requiredFields = ['companyName', 'contactName', 'email', 'phone', 'location', 'projectDescription']
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `El campo ${field} es requerido` },
          { status: 400 }
        )
      }
    }

    // Validar formato de email
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Validar formato de teléfono
    if (!isValidPhone(body.phone)) {
      return NextResponse.json(
        { success: false, error: 'Formato de teléfono inválido' },
        { status: 400 }
      )
    }

    // Preparar datos para Firestore
    const contactRequestData = {
      companyName: body.companyName.trim(),
      contactName: body.contactName.trim(),
      email: body.email.toLowerCase().trim(),
      phone: body.phone.trim(),
      branchId: body.branchId || null,
      location: body.location.trim(),
      estimatedBudget: body.estimatedBudget || null,
      projectDescription: body.projectDescription.trim(),
      subscribeNewsletter: Boolean(body.subscribeNewsletter),
      status: 'pendiente',
      source: 'web_form',
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, 'contactRequests'), contactRequestData)
    
    // Generar ID de seguimiento legible
    const trackingId = `FM-${Date.now().toString().slice(-6)}-${docRef.id.slice(-4).toUpperCase()}`
    
    // Actualizar documento con ID de seguimiento
    await addDoc(collection(db, 'contactRequests'), {
      ...contactRequestData,
      id: docRef.id,
      trackingId
    })

    // Enviar email de confirmación al cliente
    try {
      await sendContactConfirmation(
        body.email,
        body.contactName,
        trackingId
      )
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // No fallar la request si el email falla, solo loggear
    }

    // Registrar en logs del sistema
    try {
      await createSystemLog({
        action: 'contact_request_created',
        details: `Nueva solicitud de contacto de ${body.companyName} (${body.email})`,
        ipAddress: contactRequestData.ipAddress,
        userAgent: contactRequestData.userAgent
      })
    } catch (logError) {
      console.error('Error creating system log:', logError)
    }

    // Suscribir al newsletter si se solicitó
    if (body.subscribeNewsletter) {
      try {
        // Verificar si ya está suscrito
        const q = query(
          collection(db, 'newsletterSubscriptions'),
          where('email', '==', body.email.toLowerCase().trim())
        )
        const existingSubscription = await getDocs(q)
        
        if (existingSubscription.empty) {
          await addDoc(collection(db, 'newsletterSubscriptions'), {
            email: body.email.toLowerCase().trim(),
            subscribedAt: serverTimestamp(),
            active: true,
            source: 'contact_form',
            ipAddress: contactRequestData.ipAddress
          })
        }
      } catch (newsletterError) {
        console.error('Error subscribing to newsletter:', newsletterError)
        // No fallar la request si la suscripción falla
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitud enviada correctamente',
      trackingId,
      requestId: docRef.id
    })

  } catch (error) {
    console.error('Error processing contact request:', error)
    
    // Registrar error en logs si es posible
    try {
      await createSystemLog({
        action: 'contact_request_error',
        details: `Error procesando solicitud: ${error instanceof Error ? error.message : 'Unknown error'}`,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      })
    } catch (logError) {
      console.error('Error logging system error:', logError)
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor. Por favor intenta de nuevo.' 
      },
      { status: 500 }
    )
  }
}

// Manejar método GET para verificar que el endpoint funciona
export async function GET() {
  return NextResponse.json({
    message: 'Contact API endpoint is working',
    timestamp: new Date().toISOString()
  })
}