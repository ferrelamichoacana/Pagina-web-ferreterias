import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function DELETE(request: NextRequest) {
  try {
    const { cloudinaryId } = await request.json()

    if (!cloudinaryId) {
      return NextResponse.json(
        { error: 'ID de Cloudinary requerido' },
        { status: 400 }
      )
    }

    // Eliminar archivo de Cloudinary
    const result = await cloudinary.uploader.destroy(cloudinaryId)

    if (result.result === 'ok') {
      return NextResponse.json({ 
        success: true, 
        message: 'Archivo eliminado correctamente' 
      })
    } else {
      return NextResponse.json(
        { error: 'Error al eliminar archivo de Cloudinary' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}