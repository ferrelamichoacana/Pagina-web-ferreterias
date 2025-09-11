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

// GET - Obtener todas las marcas
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
    const featuredOnly = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')

    const brandsRef = collection(db, 'brands')
    let q = query(brandsRef, orderBy('name'))
    
    // Aplicar filtros
    const conditions: any[] = []
    if (activeOnly) conditions.push(where('active', '==', true))
    if (featuredOnly) conditions.push(where('featured', '==', true))
    if (category) conditions.push(where('category', '==', category))

    if (conditions.length > 0) {
      q = query(brandsRef, ...conditions, orderBy('name'))
    }

    const snapshot = await getDocs(q)
    const brands = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      data: brands,
      count: brands.length
    })

  } catch (error) {
    console.error('Error fetching brands:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener marcas' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva marca
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
    const requiredFields = ['name', 'category']
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `El campo ${field} es requerido` },
          { status: 400 }
        )
      }
    }

    // Validar URL del logo si se proporciona
    if (body.logo && !body.logo.startsWith('/') && !body.logo.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL del logo inválida' },
        { status: 400 }
      )
    }

    // Validar URL del sitio web si se proporciona
    if (body.website && !body.website.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL del sitio web debe comenzar con http:// o https://' },
        { status: 400 }
      )
    }

    // Preparar datos para Firestore
    const brandData = {
      customId: body.customId || `brand_${Date.now()}`,
      name: body.name.trim(),
      logo: body.logo?.trim() || '',
      category: body.category.trim(),
      featured: Boolean(body.featured),
      active: true,
      description: body.description?.trim() || '',
      website: body.website?.trim() || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    // Guardar en Firestore
    const brandsRef = collection(db, 'brands')
    const docRef = await addDoc(brandsRef, brandData)

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...brandData
      },
      message: 'Marca creada exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating brand:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear marca' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar marca
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
        { success: false, error: 'ID de marca requerido' },
        { status: 400 }
      )
    }

    // Validar URL del logo si se proporciona
    if (updateData.logo && !updateData.logo.startsWith('/') && !updateData.logo.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL del logo inválida' },
        { status: 400 }
      )
    }

    // Validar URL del sitio web si se proporciona
    if (updateData.website && updateData.website.trim() && !updateData.website.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL del sitio web debe comenzar con http:// o https://' },
        { status: 400 }
      )
    }

    // Limpiar campos de texto
    const textFields = ['name', 'logo', 'category', 'description', 'website']
    textFields.forEach(field => {
      if (updateData[field]) {
        updateData[field] = updateData[field].trim()
      }
    })

    // Actualizar timestamp
    updateData.updatedAt = serverTimestamp()

    // Actualizar en Firestore
    const brandRef = doc(db, 'brands', id)
    await updateDoc(brandRef, updateData)

    return NextResponse.json({
      success: true,
      message: 'Marca actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error updating brand:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar marca' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar marca (soft delete)
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
        { success: false, error: 'ID de marca requerido' },
        { status: 400 }
      )
    }

    // Soft delete - marcar como inactiva
    const brandRef = doc(db, 'brands', id)
    await updateDoc(brandRef, {
      active: false,
      updatedAt: serverTimestamp()
    })

    return NextResponse.json({
      success: true,
      message: 'Marca eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting brand:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar marca' },
      { status: 500 }
    )
  }
}
