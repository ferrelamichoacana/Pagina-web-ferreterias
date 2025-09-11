// Función para subir archivos a Cloudinary usando API route
export async function uploadToCloudinary(file: File, folder: string = 'ferreteria-la-michoacana') {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('preset', 'default')

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Función para eliminar archivos de Cloudinary usando API route
export async function deleteFromCloudinary(publicId: string) {
  try {
    const response = await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
      method: 'DELETE'
    })

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

// Función para generar URLs optimizadas
export function getOptimizedImageUrl(publicId: string, options: {
  width?: number
  height?: number
  quality?: string | number
  format?: string
} = {}) {
  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'auto'
  } = options

  let transformation = `q_${quality},f_${format}`
  
  if (width) transformation += `,w_${width}`
  if (height) transformation += `,h_${height},c_fill`

  return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformation}/${publicId}`
}

// Presets de transformación para diferentes usos
export const imagePresets = {
  // Para logos de marcas
  brandLogo: {
    width: 200,
    height: 200,
    quality: 'auto',
    format: 'png'
  },
  
  // Para imágenes de noticias/promociones
  newsImage: {
    width: 600,
    height: 400,
    quality: 80,
    format: 'webp'
  },
  
  // Para avatares de usuario
  avatar: {
    width: 150,
    height: 150,
    quality: 'auto',
    format: 'webp'
  },
  
  // Para capturas de pantalla en tickets IT
  screenshot: {
    width: 800,
    height: 600,
    quality: 70,
    format: 'webp'
  },
  
  // Para CVs (documentos)
  document: {
    quality: 'auto',
    format: 'pdf'
  }
}

// Función para subir con preset específico
export async function uploadWithPreset(
  file: File, 
  presetName: keyof typeof imagePresets,
  folder: string = 'ferreteria-la-michoacana'
) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('preset', presetName)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    
    if (result.success) {
      const preset = imagePresets[presetName]
      return {
        ...result,
        optimizedUrl: getOptimizedImageUrl(result.publicId, preset)
      }
    }
    
    return result
  } catch (error) {
    console.error('Error uploading with preset:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

// Función para validar tipos de archivo
export function validateFileType(file: File, allowedTypes: string[]) {
  return allowedTypes.includes(file.type)
}

// Función para validar tamaño de archivo
export function validateFileSize(file: File, maxSizeMB: number) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

// Validaciones específicas por tipo de archivo
export const fileValidations = {
  image: {
    types: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    maxSize: 5 // MB
  },
  document: {
    types: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxSize: 10 // MB
  },
  cv: {
    types: ['application/pdf'],
    maxSize: 5 // MB
  }
}

// Función de validación completa
export function validateFile(file: File, validationType: keyof typeof fileValidations) {
  const validation = fileValidations[validationType]
  
  const errors: string[] = []
  
  if (!validateFileType(file, validation.types)) {
    errors.push(`Tipo de archivo no permitido. Tipos válidos: ${validation.types.join(', ')}`)
  }
  
  if (!validateFileSize(file, validation.maxSize)) {
    errors.push(`Archivo muy grande. Tamaño máximo: ${validation.maxSize}MB`)
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}