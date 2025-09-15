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

// GET - Obtener una promoción específica
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de promoción requerido' },
        { status: 400 }
      )
    }

    const promotionDoc = await adminDb.collection('promotions').doc(id).get()

    if (!promotionDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Promoción no encontrada' },
        { status: 404 }
      )
    }

    const data = promotionDoc.data()
    const promotion: Promotion = {
      id: promotionDoc.id,
      ...data,
      startDate: data?.startDate?.toDate() || new Date(),
      endDate: data?.endDate?.toDate() || new Date(),
      createdAt: data?.createdAt?.toDate() || new Date(),
      updatedAt: data?.updatedAt?.toDate() || new Date(),
    } as Promotion

    return NextResponse.json({
      success: true,
      data: promotion
    })

  } catch (error) {
    console.error('Error fetching promotion:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener promoción',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// PUT - Actualizar promoción
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de promoción requerido' },
        { status: 400 }
      )
    }

    // Verificar autenticación y autorización
    const authResult = await verifyAuthAndRole(request, ['admin', 'gerente'])
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    const { userId } = authResult

    // Verificar que la promoción existe
    const promotionDoc = await adminDb.collection('promotions').doc(id).get()
    
    if (!promotionDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Promoción no encontrada' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, imageUrl, contactInfo, startDate, endDate, active, order } = body

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

    // Preparar datos actualizados
    const updateData = {
      title,
      description,
      imageUrl,
      contactInfo,
      startDate: start,
      endDate: end,
      active: active !== undefined ? active : true,
      order: order !== undefined ? order : promotionDoc.data()?.order || 1,
      updatedAt: new Date(),
      updatedBy: userId
    }

    // Actualizar la promoción
    await adminDb.collection('promotions').doc(id).update(updateData)

    // Obtener la promoción actualizada
    const updatedPromotionDoc = await adminDb.collection('promotions').doc(id).get()
    const updatedData = updatedPromotionDoc.data()

    const updatedPromotion: Promotion = {
      id,
      ...updatedData,
      startDate: updatedData?.startDate?.toDate() || new Date(),
      endDate: updatedData?.endDate?.toDate() || new Date(),
      createdAt: updatedData?.createdAt?.toDate() || new Date(),
      updatedAt: updatedData?.updatedAt?.toDate() || new Date(),
    } as Promotion

    return NextResponse.json({
      success: true,
      data: updatedPromotion,
      message: 'Promoción actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error updating promotion:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar promoción',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar promoción
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de promoción requerido' },
        { status: 400 }
      )
    }

    // Verificar autenticación y autorización
    const authResult = await verifyAuthAndRole(request, ['admin', 'gerente'])
    
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      )
    }

    // Verificar que la promoción existe
    const promotionDoc = await adminDb.collection('promotions').doc(id).get()
    
    if (!promotionDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'Promoción no encontrada' },
        { status: 404 }
      )
    }

    // Eliminar la promoción
    await adminDb.collection('promotions').doc(id).delete()

    return NextResponse.json({
      success: true,
      message: 'Promoción eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting promotion:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar promoción',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}