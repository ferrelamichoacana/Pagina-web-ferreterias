import { NextRequest, NextResponse } from 'next/server'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// GET - Obtener todas las sucursales
export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    const branchesRef = collection(db, 'branches')
    let q = query(branchesRef, orderBy('name'))
    
    if (activeOnly) {
      q = query(branchesRef, where('active', '==', true), orderBy('name'))
    }

    const snapshot = await getDocs(q)
    const branches = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      data: branches,
      count: branches.length
    })

  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener sucursales' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva sucursal
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const body = await request.json()

    // Validar campos requeridos
    const requiredFields = ['name', 'city', 'state', 'address', 'phone', 'email']
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `El campo ${field} es requerido` },
          { status: 400 }
        )
      }
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Formato de email inválido' },
        { status: 400 }
      )
    }

    // Validar coordenadas si se proporcionan
    if (body.coordinates) {
      const { lat, lng } = body.coordinates
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        return NextResponse.json(
          { success: false, error: 'Coordenadas inválidas' },
          { status: 400 }
        )
      }
    }

    // Preparar datos para Firestore
    const branchData = {
      customId: body.customId || `branch_${Date.now()}`,
      name: body.name.trim(),
      city: body.city.trim(),
      state: body.state.trim(),
      address: body.address.trim(),
      phone: body.phone.trim(),
      email: body.email.toLowerCase().trim(),
      schedule: body.schedule?.trim() || '',
      coordinates: body.coordinates || null,
      isMain: Boolean(body.isMain),
      managerId: body.managerId || null,
      services: Array.isArray(body.services) ? body.services : [],
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    // Guardar en Firestore
    const branchesRef = collection(db, 'branches')
    const docRef = await addDoc(branchesRef, branchData)

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...branchData
      },
      message: 'Sucursal creada exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating branch:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear sucursal' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar sucursal
export async function PUT(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de sucursal requerido' },
        { status: 400 }
      )
    }

    // Validar email si se proporciona
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(updateData.email)) {
        return NextResponse.json(
          { success: false, error: 'Formato de email inválido' },
          { status: 400 }
        )
      }
      updateData.email = updateData.email.toLowerCase().trim()
    }

    // Limpiar campos de texto
    const textFields = ['name', 'city', 'state', 'address', 'phone', 'schedule']
    textFields.forEach(field => {
      if (updateData[field]) {
        updateData[field] = updateData[field].trim()
      }
    })

    // Actualizar timestamp
    updateData.updatedAt = serverTimestamp()

    // Actualizar en Firestore
    const branchRef = doc(db, 'branches', id)
    await updateDoc(branchRef, updateData)

    return NextResponse.json({
      success: true,
      message: 'Sucursal actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error updating branch:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar sucursal' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar sucursal (soft delete)
export async function DELETE(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de sucursal requerido' },
        { status: 400 }
      )
    }

    // Soft delete - marcar como inactiva
    const branchRef = doc(db, 'branches', id)
    await updateDoc(branchRef, {
      active: false,
      updatedAt: serverTimestamp()
    })

    return NextResponse.json({
      success: true,
      message: 'Sucursal eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting branch:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar sucursal' },
      { status: 500 }
    )
  }
}
