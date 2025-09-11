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
    console.log('🚀 API POST /api/brands iniciado')
    
    if (!db) {
      console.error('❌ Firebase no configurado')
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log('📥 Datos recibidos:', body)

    // Validar campos requeridos
    const requiredFields = ['name', 'category']
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        const errorMsg = `El campo ${field} es requerido`
        console.error('❌ Validación fallida:', errorMsg)
        return NextResponse.json(
          { success: false, error: errorMsg },
          { status: 400 }
        )
      }
    }

    // Validar URL del logo si se proporciona
    if (body.logo && !body.logo.startsWith('/') && !body.logo.startsWith('http')) {
      const errorMsg = 'URL del logo inválida'
      console.error('❌ Logo inválido:', body.logo)
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      )
    }

    // Mejorar validación y normalización del sitio web
    let website = null
    if (body.website && body.website.trim() !== '') {
      const websiteValue = body.website.trim()
      
      // Si no tiene protocolo, agregar https://
      if (!websiteValue.startsWith('http://') && !websiteValue.startsWith('https://')) {
        website = `https://${websiteValue}`
      } else {
        website = websiteValue
      }
      
      console.log('🌐 Website procesado:', {
        original: body.website,
        processed: website
      })
    }

    // Preparar datos para Firestore
    const brandData = {
      customId: body.customId || `brand_${Date.now()}`,
      name: body.name.trim(),
      logoUrl: body.logo?.trim() || '',
      category: body.category.trim(),
      featured: Boolean(body.featured),
      active: Boolean(body.active !== undefined ? body.active : true),
      description: body.description?.trim() || '',
      website: website || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    console.log('💾 Guardando en Firestore:', brandData)

    // Guardar en Firestore
    const brandsRef = collection(db, 'brands')
    const docRef = await addDoc(brandsRef, brandData)

    console.log('✅ Marca creada con ID:', docRef.id)

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...brandData
      },
      message: 'Marca creada exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('💥 Error creating brand:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear marca: ' + (error instanceof Error ? error.message : 'Error desconocido') },
      { status: 500 }
    )
  }
}

// PUT - Actualizar marca
export async function PUT(request: NextRequest) {
  try {
    console.log('🔄 API PUT /api/brands iniciado')
    
    if (!db) {
      console.error('❌ Firebase no configurado')
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const body = await request.json()
    console.log('📥 Datos de actualización recibidos:', body)
    
    const { id, ...updateData } = body

    if (!id) {
      console.error('❌ ID faltante')
      return NextResponse.json(
        { success: false, error: 'ID de marca requerido' },
        { status: 400 }
      )
    }

    // Validar URL del logo si se proporciona
    if (updateData.logo && !updateData.logo.startsWith('/') && !updateData.logo.startsWith('http')) {
      const errorMsg = 'URL del logo inválida'
      console.error('❌ Logo inválido:', updateData.logo)
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      )
    }

    // Mejorar validación y normalización del sitio web
    if (updateData.website !== undefined) {
      if (updateData.website && updateData.website.trim() !== '') {
        const websiteValue = updateData.website.trim()
        
        // Si no tiene protocolo, agregar https://
        if (!websiteValue.startsWith('http://') && !websiteValue.startsWith('https://')) {
          updateData.website = `https://${websiteValue}`
        } else {
          updateData.website = websiteValue
        }
        
        console.log('🌐 Website actualizado procesado:', {
          original: body.website,
          processed: updateData.website
        })
      } else {
        updateData.website = ''
      }
    }

    // Limpiar campos de texto
    const textFields = ['name', 'category', 'description']
    textFields.forEach(field => {
      if (updateData[field]) {
        updateData[field] = updateData[field].trim()
      }
    })

    // Mapear logo a logoUrl para consistencia
    if (updateData.logo !== undefined) {
      updateData.logoUrl = updateData.logo
      delete updateData.logo
    }

    // Actualizar timestamp
    updateData.updatedAt = serverTimestamp()

    console.log('💾 Actualizando en Firestore:', { id, updateData })

    // Actualizar en Firestore
    const brandRef = doc(db, 'brands', id)
    await updateDoc(brandRef, updateData)

    console.log('✅ Marca actualizada exitosamente')

    return NextResponse.json({
      success: true,
      message: 'Marca actualizada exitosamente'
    })

  } catch (error) {
    console.error('💥 Error updating brand:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar marca: ' + (error instanceof Error ? error.message : 'Error desconocido') },
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
