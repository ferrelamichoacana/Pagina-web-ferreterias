import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Iniciando subida de imagen...')
    
    // Verificar que las variables de entorno estén configuradas
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Variables de entorno de Cloudinary no configuradas')
      return NextResponse.json(
        { error: 'Configuración de Cloudinary incompleta' },
        { status: 500 }
      )
    }

    console.log('✅ Variables de entorno OK')
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'ferreterias/promotions'

    console.log(`📁 Folder: ${folder}`)
    console.log(`📄 File: ${file?.name}, Size: ${file?.size}, Type: ${file?.type}`)

    if (!file) {
      console.error('❌ No se proporcionó archivo')
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      console.error(`❌ Tipo de archivo no permitido: ${file.type}`)
      return NextResponse.json(
        { error: 'Tipo de archivo no permitido. Solo se aceptan imágenes.' },
        { status: 400 }
      )
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      console.error(`❌ Archivo demasiado grande: ${file.size} bytes`)
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB.' },
        { status: 400 }
      )
    }

    console.log('✅ Validaciones pasadas, convirtiendo a buffer...')
    
    // Convertir el archivo a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    console.log(`📦 Buffer creado: ${buffer.length} bytes`)
    console.log('☁️ Subiendo a Cloudinary...')

    // Subir a Cloudinary usando upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' }, // Limitar tamaño máximo
            { quality: 'auto' }, // Optimización automática de calidad
            { format: 'auto' } // Formato automático (WebP cuando sea posible)
          ]
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      ).end(buffer)
    })

    const result = uploadResult as any

    console.log('✅ Subida exitosa a Cloudinary:', {
      url: result.secure_url,
      publicId: result.public_id,
      size: `${result.width}x${result.height}`,
      format: result.format
    })

    return NextResponse.json({
      success: true,
      imageUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    })

  } catch (error) {
    console.error('❌ Error uploading to Cloudinary:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return NextResponse.json(
      { 
        error: 'Error al subir la imagen',
        details: error instanceof Error ? error.message : 'Error desconocido'
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