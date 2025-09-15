import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: NextRequest) {
  console.log('🚀 === INICIO API UPLOAD IMAGE ===')
  console.log('📅 Timestamp:', new Date().toISOString())
  console.log('🌍 Environment:', process.env.NODE_ENV)
  console.log('🔗 Request URL:', request.url)
  console.log('� Request headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    console.log('🔍 Paso 1: Verificando variables de entorno...')
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET
    
    console.log('🔑 Cloud Name:', cloudName ? '✅ Presente' : '❌ Faltante')
    console.log('🔑 API Key:', apiKey ? '✅ Presente' : '❌ Faltante')
    console.log('🔑 API Secret:', apiSecret ? '✅ Presente' : '❌ Faltante')
    
    if (!cloudName || !apiKey || !apiSecret) {
      console.error('❌ FALLO: Variables de entorno de Cloudinary no configuradas')
      console.log('📋 Variables disponibles:', Object.keys(process.env).filter(k => k.includes('CLOUDINARY')))
      return NextResponse.json(
        { error: 'Configuración de Cloudinary incompleta' },
        { status: 500 }
      )
    }

    console.log('✅ Paso 1 completado: Variables de entorno verificadas')
    
    // Configurar Cloudinary
    console.log('🔧 Paso 2: Configurando Cloudinary...')
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    })
    console.log('✅ Paso 2 completado: Cloudinary configurado')
    
    console.log('📦 Paso 3: Procesando FormData...')
    let formData
    try {
      formData = await request.formData()
      console.log('✅ FormData procesado exitosamente')
      console.log('📋 FormData keys:', Array.from(formData.keys()))
    } catch (formDataError) {
      console.error('❌ Error procesando FormData:', formDataError)
      throw formDataError
    }
    
    console.log('📄 Paso 4: Extrayendo archivo...')
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'ferreterias/promotions'

    console.log('📁 Folder configurado:', folder)
    
    if (!file) {
      console.error('❌ FALLO: No se encontró archivo en FormData')
      console.log('📋 Contenido FormData:', Array.from(formData.entries()).map(([k, v]) => [k, typeof v]))
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }
    
    console.log('📄 Información del archivo:')
    console.log('  - Nombre:', file.name)
    console.log('  - Tamaño:', file.size, 'bytes')
    console.log('  - Tipo:', file.type)
    console.log('  - Última modificación:', file.lastModified ? new Date(file.lastModified).toISOString() : 'N/A')
    console.log('✅ Paso 4 completado: Archivo extraído')

    console.log('🔍 Paso 5: Validando tipo de archivo...')
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    console.log('✅ Tipos permitidos:', allowedTypes)
    console.log('📋 Tipo recibido:', file.type)
    
    if (!allowedTypes.includes(file.type)) {
      console.error(`❌ FALLO: Tipo de archivo no permitido: ${file.type}`)
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se aceptan imágenes.' },
        { status: 400 }
      )
    }
    console.log('✅ Paso 5 completado: Tipo de archivo válido')

    console.log('📏 Paso 6: Validando tamaño...')
    const maxSize = 10 * 1024 * 1024
    console.log('📋 Tamaño máximo:', maxSize, 'bytes (10MB)')
    console.log('📋 Tamaño archivo:', file.size, 'bytes')
    
    if (file.size > maxSize) {
      console.error(`❌ FALLO: Archivo demasiado grande: ${file.size} bytes`)
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB.' },
        { status: 400 }
      )
    }
    console.log('✅ Paso 6 completado: Tamaño válido')

    console.log('🔄 Paso 7: Convirtiendo archivo a buffer...')
    let bytes, buffer
    try {
      bytes = await file.arrayBuffer()
      buffer = Buffer.from(bytes)
      console.log(`✅ Buffer creado exitosamente: ${buffer.length} bytes`)
    } catch (bufferError) {
      console.error('❌ Error convirtiendo a buffer:', bufferError)
      throw bufferError
    }
    console.log('✅ Paso 7 completado: Buffer creado')

    console.log('☁️ Paso 8: Subiendo a Cloudinary...')
    console.log('📋 Configuración de subida:')
    console.log('  - Folder:', folder)
    console.log('  - Resource type: image')
    console.log('  - Transformaciones: width 1200, height 800, crop limit, quality auto, format auto')
    
    let uploadResult
    try {
      uploadResult = await new Promise((resolve, reject) => {
        console.log('🚀 Iniciando upload_stream...')
        
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: folder,
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
              { format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              console.error('❌ Error en upload_stream callback:', error)
              console.error('Error details:', {
                message: error.message,
                http_code: error.http_code,
                name: error.name
              })
              reject(error)
            } else {
              console.log('✅ Upload exitoso en callback')
              console.log('📋 Resultado:', {
                public_id: result?.public_id,
                secure_url: result?.secure_url,
                width: result?.width,
                height: result?.height,
                format: result?.format,
                bytes: result?.bytes
              })
              resolve(result)
            }
          }
        )
        
        console.log('📤 Enviando buffer al stream...')
        uploadStream.end(buffer)
      })
      console.log('✅ Paso 8 completado: Subida a Cloudinary exitosa')
    } catch (cloudinaryError) {
      console.error('❌ Error en subida a Cloudinary:', cloudinaryError)
      throw cloudinaryError
    }

    console.log('📋 Paso 9: Procesando resultado...')
    const result = uploadResult as any

    console.log('✅ Resultado completo de Cloudinary:', {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      created_at: result.created_at
    })

    const responseData = {
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    }
    
    console.log('📤 Paso 10: Enviando respuesta exitosa...')
    console.log('📋 Response data:', responseData)
    console.log('🎉 === FIN API UPLOAD IMAGE (EXITOSO) ===')

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('💥 === ERROR EN API UPLOAD IMAGE ===')
    console.error('📅 Timestamp:', new Date().toISOString())
    console.error('🐛 Error principal:', error)
    console.error('📋 Error type:', typeof error)
    console.error('📋 Error constructor:', error?.constructor?.name)
    
    if (error instanceof Error) {
      console.error('📝 Error message:', error.message)
      console.error('📚 Error stack:', error.stack)
      console.error('📋 Error name:', error.name)
    }
    
    // Si es un error de Cloudinary, mostrar detalles específicos
    if (error && typeof error === 'object') {
      console.error('🔍 Error object keys:', Object.keys(error))
      console.error('🔍 Error object:', error)
    }
    
    console.error('🌍 Environment vars check:')
    console.error('  - NODE_ENV:', process.env.NODE_ENV)
    console.error('  - CLOUDINARY vars available:', Object.keys(process.env).filter(k => k.includes('CLOUDINARY')))
    
    console.error('💥 === FIN ERROR API UPLOAD IMAGE ===')
    
    return NextResponse.json(
      { 
        error: 'Error al subir la imagen',
        details: error instanceof Error ? error.message : 'Error desconocido',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
      },
      { status: 500 }
    )
  }
}

// Endpoint para eliminar imágenes
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { error: 'Se requiere el publicId para eliminar la imagen' },
        { status: 400 }
      )
    }

    // Eliminar de Cloudinary
    const result = await cloudinary.uploader.destroy(publicId)

    return NextResponse.json({
      success: true,
      result: result.result
    })

  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return NextResponse.json(
      { 
        error: 'Error al eliminar la imagen',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}