import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configuración de Cloudinary (solo en el servidor)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'ferreteria-la-michoacana'
    const preset = formData.get('preset') as string || 'default'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convertir File a base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    // Configurar transformación según el preset
    let transformation: any = {
      quality: 'auto',
      fetch_format: 'auto'
    }

    switch (preset) {
      case 'brandLogo':
        transformation = {
          width: 200,
          height: 200,
          crop: 'fill',
          quality: 'auto',
          format: 'png'
        }
        break
      case 'newsImage':
        transformation = {
          width: 600,
          height: 400,
          crop: 'fill',
          quality: 80,
          format: 'webp'
        }
        break
      case 'avatar':
        transformation = {
          width: 150,
          height: 150,
          crop: 'fill',
          quality: 'auto',
          format: 'webp'
        }
        break
      case 'screenshot':
        transformation = {
          width: 800,
          height: 600,
          crop: 'fill',
          quality: 70,
          format: 'webp'
        }
        break
    }

    // Subir a Cloudinary
    const uploadOptions: any = {
      folder: `${folder}/${preset}`,
      resource_type: 'auto'
    }

    // Solo agregar transformación para imágenes
    if (file.type.startsWith('image/')) {
      uploadOptions.transformation = [transformation]
    }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions)

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    })

  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    
    let errorMessage = 'Error al subir archivo'
    if (error instanceof Error) {
      errorMessage = error.message
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No publicId provided' },
        { status: 400 }
      )
    }

    const result = await cloudinary.uploader.destroy(publicId)
    
    return NextResponse.json({
      success: result.result === 'ok',
      result
    })

  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      },
      { status: 500 }
    )
  }
}