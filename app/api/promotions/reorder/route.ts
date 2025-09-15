import { NextRequest, NextResponse } from 'next/server'
import { adminDb, adminAuth } from '@/lib/firebase/admin'

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

// PUT - Reordenar promociones
export async function PUT(request: NextRequest) {
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
    const { promotionIds } = body

    // Validar que se proporcione un arreglo de IDs
    if (!Array.isArray(promotionIds) || promotionIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Se requiere un arreglo de IDs de promociones' },
        { status: 400 }
      )
    }

    const batch = adminDb.batch()

    // Actualizar el orden de cada promoción
    promotionIds.forEach((promotionId: string, index: number) => {
      const promotionRef = adminDb.collection('promotions').doc(promotionId)
      batch.update(promotionRef, {
        order: index + 1,
        updatedAt: new Date(),
        updatedBy: userId
      })
    })

    // Ejecutar todas las actualizaciones
    await batch.commit()

    return NextResponse.json({
      success: true,
      message: 'Orden de promociones actualizado exitosamente',
      data: {
        updatedCount: promotionIds.length,
        updatedBy: userId
      }
    })

  } catch (error) {
    console.error('Error reordering promotions:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al reordenar promociones',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}