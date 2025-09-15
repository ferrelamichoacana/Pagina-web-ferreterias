'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader } from 'lucide-react'

interface ImageUploaderProps {
  onImageUploaded: (imageUrl: string) => void
  currentImageUrl?: string
  className?: string
  placeholder?: string
}

export default function ImageUploader({ 
  onImageUploaded, 
  currentImageUrl, 
  className = '',
  placeholder = 'Arrastra una imagen aquí o haz clic para seleccionar'
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (file: File): boolean => {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      setError('Solo se permiten archivos de imagen (JPEG, PNG, WebP, GIF)')
      return false
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError('El archivo es demasiado grande. Máximo 10MB')
      return false
    }

    return true
  }

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'promotions') // Preset para promociones
    formData.append('folder', 'ferreterias/promotions')

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al subir la imagen')
    }

    const data = await response.json()
    return data.imageUrl
  }

  const handleFileUpload = useCallback(async (file: File) => {
    setError(null)
    setIsUploading(true)

    try {
      if (!validateFile(file)) {
        return
      }

      // Crear preview local
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Subir a Cloudinary
      const imageUrl = await uploadToCloudinary(file)
      
      // Limpiar object URL y usar la URL de Cloudinary
      URL.revokeObjectURL(objectUrl)
      setPreviewUrl(imageUrl)
      
      // Notificar al componente padre
      onImageUploaded(imageUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      setError(error instanceof Error ? error.message : 'Error al subir la imagen')
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
    }
  }, [onImageUploaded])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileUpload(files[0])
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files[0])
    }
  }

  const handleRemoveImage = () => {
    setPreviewUrl(null)
    setError(null)
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <div className="space-y-4">
        {/* Área de carga */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
            ${isDragging 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }
            ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center space-y-2">
              <Loader className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-sm text-gray-600">Subiendo imagen...</p>
            </div>
          ) : previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-h-48 mx-auto rounded-lg shadow-md"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveImage()
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <div className="p-3 bg-gray-100 rounded-full">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {placeholder}
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP hasta 10MB
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Upload className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-blue-600 font-medium">
                  Seleccionar archivo
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Success message */}
        {previewUrl && !isUploading && !error && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">
              ✅ Imagen cargada exitosamente
            </p>
          </div>
        )}
      </div>
    </div>
  )
}