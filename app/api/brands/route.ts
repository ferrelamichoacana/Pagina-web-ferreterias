import { NextRequest, NextResponse } from 'next/server'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { getFirestore, checkFirebaseAvailability } from '@/lib/firebase/utils'

// Definir el tipo Brand
interface Brand {
  id: string
  name: string
  logo: string
  website: string
  description: string
  isActive: boolean
  categories: string[]
  createdAt: Date
  updatedAt: Date
}

// GET - Obtener todas las marcas
export async function GET(request: NextRequest) {
  try {
    // Verificar configuración de Firebase con más detalle
    if (!checkFirebaseAvailability()) {
      console.error('❌ Firebase no está disponible en GET')
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const db = getFirestore()
    console.log('✅ Firebase DB obtenido exitosamente')

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'
    const featuredOnly = searchParams.get('featured') === 'true'
    const category = searchParams.get('category')

    console.log('📊 Obteniendo marcas con filtros:', { activeOnly, featuredOnly, category })

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

    console.log(`✅ Obtenidas ${brands.length} marcas`)

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
    
    if (!checkFirebaseAvailability()) {
      console.error('❌ Firebase no está disponible en POST')
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const db = getFirestore()
    console.log('✅ Firebase DB obtenido para POST')

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

    // Preparar datos para Firestore (sin ID, Firestore lo generará)
    const brandData = {
      name: body.name,
      logo: body.logo || '',
      website: website || '',
      description: body.description || '',
      isActive: body.isActive ?? true,
      categories: body.categories || [],
      catalogos: body.catalogos || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    console.log('📦 Brand data preparado:', brandData)

    // Verificar si ya existe una marca con el mismo nombre
    const existingBrands = await getDocs(
      query(collection(db, 'brands'), where('name', '==', body.name))
    )

    if (!existingBrands.empty) {
      console.log('⚠️ Marca ya existe:', body.name)
      return NextResponse.json(
        { success: false, error: 'Ya existe una marca con este nombre' },
        { status: 409 }
      )
    }

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
    
    const db = getFirestore()
    
    if (!checkFirebaseAvailability()) {
      console.error('❌ Firebase no está disponible en PUT')
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

    // Manejar catálogos
    if (updateData.catalogos !== undefined) {
      // Si es un array vacío, establecer a null
      updateData.catalogos = updateData.catalogos && updateData.catalogos.length > 0 
        ? updateData.catalogos 
        : null
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

// DELETE - Eliminar marca completamente
export async function DELETE(request: NextRequest) {
  const startTime = new Date().toISOString()
  console.log('🚀 DELETE /api/brands INICIADO:', startTime)
  
  try {
    const db = getFirestore()
    console.log('✅ Firestore DB obtenido')
    
    if (!checkFirebaseAvailability()) {
      console.error('❌ Firebase no está disponible en DELETE')
      return NextResponse.json(
        { success: false, error: 'Firebase no está configurado' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    console.log('📋 Parámetros recibidos:', { id, url: request.url })

    if (!id) {
      console.error('❌ ID faltante en request')
      return NextResponse.json(
        { success: false, error: 'ID de marca requerido' },
        { status: 400 }
      )
    }

    console.log(`🗑️  ELIMINANDO marca con ID: ${id}`)

    // Verificar si la marca existe antes de eliminar
    const brandRef = doc(db, 'brands', id)
    console.log('📄 Referencia creada:', brandRef.path)
    
    try {
      const brandDoc = await getDoc(brandRef)
      console.log('📖 Documento verificado:', {
        exists: brandDoc.exists(),
        id: brandDoc.id,
        data: brandDoc.exists() ? brandDoc.data() : null
      })
      
      if (!brandDoc.exists()) {
        console.warn('⚠️  Marca no encontrada:', id)
        return NextResponse.json(
          { success: false, error: 'Marca no encontrada' },
          { status: 404 }
        )
      }
      
      // Eliminación completa del documento
      console.log('🔥 Ejecutando deleteDoc...')
      await deleteDoc(brandRef)
      console.log('✅ deleteDoc ejecutado exitosamente')

      console.log(`🎉 Marca ${id} eliminada exitosamente en ${new Date().toISOString()}`)

      const response = {
        success: true,
        message: 'Marca eliminada exitosamente',
        deletedId: id,
        timestamp: new Date().toISOString()
      }
      
      console.log('📤 Enviando respuesta exitosa:', response)
      
      return NextResponse.json(response)
      
    } catch (firestoreError) {
      console.error('💥 Error específico de Firestore:', {
        error: firestoreError,
        message: firestoreError instanceof Error ? firestoreError.message : 'Error desconocido',
        stack: firestoreError instanceof Error ? firestoreError.stack : undefined,
        id
      })
      throw firestoreError
    }

  } catch (error) {
    const errorTime = new Date().toISOString()
    console.error('💥 ERROR GENERAL en DELETE:', {
      error,
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      startTime,
      errorTime,
      duration: `${Date.now() - new Date(startTime).getTime()}ms`
    })
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    const response = {
      success: false,
      error: `Error al eliminar marca: ${errorMessage}`,
      timestamp: errorTime
    }
    
    console.log('📤 Enviando respuesta de error:', response)
    
    return NextResponse.json(response, { status: 500 })
  }
}
