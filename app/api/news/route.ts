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

// GET - Obtener todas las noticias
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
    const type = searchParams.get('type') // 'noticia' o 'promocion'

    const newsRef = collection(db, 'news')
    let q = query(newsRef, orderBy('date', 'desc'))
    
    // Aplicar filtros
    const conditions: any[] = []
    if (activeOnly) conditions.push(where('active', '==', true))
    if (featuredOnly) conditions.push(where('featured', '==', true))
    if (type) conditions.push(where('type', '==', type))

    if (conditions.length > 0) {
      q = query(newsRef, ...conditions, orderBy('date', 'desc'))
    }

    const snapshot = await getDocs(q)
    const news = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json({
      success: true,
      data: news,
      count: news.length
    })

  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { success: false, error: 'Error al obtener noticias' },
      { status: 500 }
    )
  }
}

// POST - Crear nueva noticia
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
    const requiredFields = ['title', 'description', 'type']
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `El campo ${field} es requerido` },
          { status: 400 }
        )
      }
    }

    // Validar tipo
    if (!['noticia', 'promocion'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo debe ser "noticia" o "promocion"' },
        { status: 400 }
      )
    }

    // Validar URL de imagen si se proporciona
    if (body.imageUrl && !body.imageUrl.startsWith('/') && !body.imageUrl.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL de imagen inválida' },
        { status: 400 }
      )
    }

    // Validar URL del link si se proporciona
    if (body.link && !body.link.startsWith('/') && !body.link.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL del link debe comenzar con / o http' },
        { status: 400 }
      )
    }

    // Preparar datos para Firestore
    const newsData = {
      title: body.title.trim(),
      description: body.description.trim(),
      type: body.type,
      imageUrl: body.imageUrl?.trim() || '',
      link: body.link?.trim() || '',
      featured: Boolean(body.featured),
      active: true,
      date: body.date ? new Date(body.date) : new Date(),
      order: body.order || 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    // Guardar en Firestore
    const newsRef = collection(db, 'news')
    const docRef = await addDoc(newsRef, newsData)

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...newsData
      },
      message: 'Noticia creada exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating news:', error)
    return NextResponse.json(
      { success: false, error: 'Error al crear noticia' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar noticia
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
        { success: false, error: 'ID de noticia requerido' },
        { status: 400 }
      )
    }

    // Validar tipo si se proporciona
    if (updateData.type && !['noticia', 'promocion'].includes(updateData.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo debe ser "noticia" o "promocion"' },
        { status: 400 }
      )
    }

    // Validar URL de imagen si se proporciona
    if (updateData.imageUrl && updateData.imageUrl.trim() && !updateData.imageUrl.startsWith('/') && !updateData.imageUrl.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL de imagen inválida' },
        { status: 400 }
      )
    }

    // Validar URL del link si se proporciona
    if (updateData.link && updateData.link.trim() && !updateData.link.startsWith('/') && !updateData.link.startsWith('http')) {
      return NextResponse.json(
        { success: false, error: 'URL del link debe comenzar con / o http' },
        { status: 400 }
      )
    }

    // Limpiar campos de texto
    const textFields = ['title', 'description', 'imageUrl', 'link']
    textFields.forEach(field => {
      if (updateData[field]) {
        updateData[field] = updateData[field].trim()
      }
    })

    // Convertir fecha si se proporciona
    if (updateData.date) {
      updateData.date = new Date(updateData.date)
    }

    // Actualizar timestamp
    updateData.updatedAt = serverTimestamp()

    // Actualizar en Firestore
    const newsRef = doc(db, 'news', id)
    await updateDoc(newsRef, updateData)

    return NextResponse.json({
      success: true,
      message: 'Noticia actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error updating news:', error)
    return NextResponse.json(
      { success: false, error: 'Error al actualizar noticia' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar noticia (soft delete)
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
        { success: false, error: 'ID de noticia requerido' },
        { status: 400 }
      )
    }

    // Soft delete - marcar como inactiva
    const newsRef = doc(db, 'news', id)
    await updateDoc(newsRef, {
      active: false,
      updatedAt: serverTimestamp()
    })

    return NextResponse.json({
      success: true,
      message: 'Noticia eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting news:', error)
    return NextResponse.json(
      { success: false, error: 'Error al eliminar noticia' },
      { status: 500 }
    )
  }
}
