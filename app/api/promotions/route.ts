import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase/admin'
import { Promotion } from '@/types'

// Función helper para verificar autenticación y autorización
async function verifyAuthAndRole(request: NextRequest, requiredRoles: string[] = []) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'Token de autenticación requerido', status: 401 }
    }

    const token = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(token)
    
    if (!decodedToken) {
      return { success: false, error: 'Token inválido', status: 401 }
    }

    // Obtener datos del usuario desde Firestore
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get()
    const userData = userDoc.data()

    if (!userData) {
      return { success: false, error: 'Usuario no encontrado', status: 404 }
    }

    // Verificar rol si es requerido
    if (requiredRoles.length > 0 && !requiredRoles.includes(userData.role)) {
      return { success: false, error: 'Permisos insuficientes', status: 403 }
    }

    return { 
      success: true, 
      userId: decodedToken.uid, 
      userRole: userData.role,
      userData 
    }
    
  } catch (error) {
    console.error('Error verificando autenticación:', error)
    return { success: false, error: 'Error de autenticación', status: 401 }
  }
}

export async function GET() {
  try {
    // Verificar que Firebase Admin esté correctamente configurado
    if (!adminDb) {
      console.error('Firebase Admin DB not initialized')
      throw new Error('Firebase Admin no inicializado correctamente')
    }

    console.log('Fetching promotions from Firestore...')

    // Obtener todas las promociones activas sin orderBy para evitar índice compuesto
    const promotionsSnapshot = await adminDb
      .collection('promotions')
      .where('active', '==', true)
      .get()

    console.log(`Found ${promotionsSnapshot.size} promotions`)

    const promotions: Promotion[] = []
    
    promotionsSnapshot.forEach((doc: any) => {
      const data = doc.data()
      
      // Manejar conversión de fechas de manera más segura
      const convertFirestoreDate = (date: any) => {
        if (!date) return new Date()
        if (date.toDate && typeof date.toDate === 'function') {
          return date.toDate()
        }
        if (date._seconds) {
          return new Date(date._seconds * 1000)
        }
        if (typeof date === 'string') {
          return new Date(date)
        }
        return new Date(date)
      }

      try {
        promotions.push({
          id: doc.id,
          ...data,
          startDate: convertFirestoreDate(data.startDate),
          endDate: convertFirestoreDate(data.endDate),
          createdAt: convertFirestoreDate(data.createdAt),
          updatedAt: convertFirestoreDate(data.updatedAt),
        } as Promotion)
      } catch (error) {
        console.error('Error processing promotion:', doc.id, error)
      }
    })

    // Ordenar en memoria por el campo order
    promotions.sort((a, b) => (a.order || 0) - (b.order || 0))

    console.log(`Successfully processed ${promotions.length} promotions`)

    const response = {
      success: true,
      data: promotions,
      count: promotions.length
    }

    // Si no hay promociones, agregar información útil
    if (promotions.length === 0) {
      console.log('No active promotions found')
      Object.assign(response, {
        message: 'No hay promociones activas en este momento',
        suggestion: 'Crear promociones desde el panel de administración'
      })
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Error fetching promotions:', error)
    
    // En lugar de error 500, devolver respuesta exitosa con datos vacíos y descripción del error
    return NextResponse.json({
      success: true,
      data: [],
      count: 0,
      warning: 'Error connecting to database, showing empty results',
      error: error instanceof Error ? error.message : 'Error desconocido',
      suggestion: 'Verificar configuración de Firebase y variables de entorno'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación y autorización
    const authResult = await verifyAuthAndRole(request, ['admin', 'gerente'])
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const { userId } = authResult

    const body = await request.json()
    const { title, description, imageUrl, contactInfo, startDate, endDate, active = true } = body

    // Validaciones
    if (!title || !description || !imageUrl || !contactInfo) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: 'Las fechas de inicio y fin son requeridas' },
        { status: 400 }
      )
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (end <= start) {
      return NextResponse.json(
        { success: false, error: 'La fecha de fin debe ser posterior a la fecha de inicio' },
        { status: 400 }
      )
    }

    // Obtener el siguiente número de orden
    const lastPromotionSnapshot = await adminDb
      .collection('promotions')
      .orderBy('order', 'desc')
      .limit(1)
      .get()

    let nextOrder = 1
    if (!lastPromotionSnapshot.empty) {
      const lastPromotion = lastPromotionSnapshot.docs[0].data()
      nextOrder = (lastPromotion.order || 0) + 1
    }

    // Crear la promoción
    const promotionData = {
      title,
      description,
      imageUrl,
      contactInfo,
      startDate: start,
      endDate: end,
      active,
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId
    }

    const docRef = await adminDb.collection('promotions').add(promotionData)

    // Obtener la promoción creada
    const newPromotionDoc = await docRef.get()
    const newPromotionData = newPromotionDoc.data()

    const newPromotion: Promotion = {
      id: docRef.id,
      ...newPromotionData,
      startDate: newPromotionData?.startDate?.toDate() || new Date(),
      endDate: newPromotionData?.endDate?.toDate() || new Date(),
      createdAt: newPromotionData?.createdAt?.toDate() || new Date(),
      updatedAt: newPromotionData?.updatedAt?.toDate() || new Date(),
    } as Promotion

    return NextResponse.json({
      success: true,
      data: newPromotion,
      message: 'Promoción creada exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating promotion:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al crear promoción',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}