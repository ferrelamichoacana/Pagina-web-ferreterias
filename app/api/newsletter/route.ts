import { NextRequest, NextResponse } from 'next/server'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore'
import { getFirestore } from '@/lib/firebase/utils'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validar email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    const db = getFirestore()

    // Verificar si el email ya está suscrito
    const q = query(
      collection(db, 'newsletterSubscriptions'),
      where('email', '==', email.toLowerCase())
    )
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Este email ya está suscrito al newsletter' },
        { status: 409 }
      )
    }

    // Crear suscripción
    const subscriptionData = {
      email: email.toLowerCase(),
      subscribedAt: serverTimestamp(),
      active: true,
      source: 'website_newsletter',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown'
    }

    const docRef = await addDoc(
      collection(db, 'newsletterSubscriptions'),
      subscriptionData
    )

    // En producción, aquí se podría enviar un email de confirmación
    // await sendWelcomeEmail(email)

    return NextResponse.json({
      success: true,
      message: 'Suscripción exitosa al newsletter',
      subscriptionId: docRef.id
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      )
    }

    const db = getFirestore()

    // Buscar y desactivar suscripción
    const q = query(
      collection(db, 'newsletterSubscriptions'),
      where('email', '==', email.toLowerCase())
    )
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      return NextResponse.json(
        { success: false, error: 'Email no encontrado en suscripciones' },
        { status: 404 }
      )
    }

    // Marcar como inactivo en lugar de eliminar (para auditoría)
    const docSnap = querySnapshot.docs[0]
    await updateDoc(docSnap.ref, {
      active: false,
      unsubscribedAt: serverTimestamp()
    })

    return NextResponse.json({
      success: true,
      message: 'Desuscripción exitosa del newsletter'
    })
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
