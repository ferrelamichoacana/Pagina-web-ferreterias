'use client'

import React, { useState, useRef, useCallback } from 'react'
import { Upload, X, File, Image, FileText, Download, Eye } from 'lucide-react'

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date
  category: 'image' | 'document' | 'other'
}

interface FileUploaderProps {
  // Configuración básica
  maxFiles?: number
  maxFileSize?: number // en MB
  acceptedTypes?: string[]
  
  // Callbacks
  onFilesUploaded?: (files: UploadedFile[]) => void
  onFileRemoved?: (fileId: string) => void
  onError?: (error: string) => void
  
  // Configuración visual
  multiple?: boolean
  showPreview?: boolean
  compact?: boolean
  
  // Archivos existentes
  existingFiles?: UploadedFile[]
  
  // Configuración de Cloudinary
  uploadPreset?: string
  folder?: string
}

export default function FileUploader({
  maxFiles = 5,
  maxFileSize = 10, // 10MB por defecto
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  onFilesUploaded,
  onFileRemoved,
  onError,
  multiple = true,
  showPreview = true,
  compact = false,
  existingFiles = [],
  uploadPreset = 'ferreteria_uploads',
  folder = 'general'
}: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función para determinar la categoría del archivo
  const getFileCategory = (type: string): 'image' | 'document' | 'other' => {
    if (type.startsWith('image/')) return 'image'
    if (type.includes('pdf') || type.includes('doc') || type.includes('text')) return 'document'
    return 'other'
  }

  // Función para obtener el icono según el tipo de archivo
  const getFileIcon = (category: string, type: string) => {
    switch (category) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" aria-label="Archivo de imagen" />
      case 'document':
        if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />
        return <FileText className="w-8 h-8 text-blue-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  // Función para formatear el tamaño del archivo
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Función para validar archivos
  const validateFile = useCallback((file: File): string | null => {
    // Validar tamaño
    if (file.size > maxFileSize * 1024 * 1024) {
      return `El archivo ${file.name} excede el tamaño máximo de ${maxFileSize}MB`
    }

    // Validar tipo
    const isValidType = acceptedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('*', ''))
      }
      return file.type === type || file.name.toLowerCase().endsWith(type)
    })

    if (!isValidType) {
      return `Tipo de archivo no permitido: ${file.name}`
    }

    return null
  }, [maxFileSize, acceptedTypes])

  // Función para subir archivo usando nuestra API
  const uploadToCloudinary = useCallback(async (file: File): Promise<UploadedFile> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)
    formData.append('preset', 'default')

    try {
      const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error('Error al subir archivo')
      }

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Error al subir archivo')
      }

      return {
        id: data.publicId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: data.url,
        uploadedAt: new Date(),
        category: getFileCategory(file.type)
      }
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      throw new Error(`Error al subir ${file.name}`)
    }
  }, [folder])

  // Función para manejar la selección de archivos
  const handleFiles = useCallback(async (selectedFiles: FileList) => {
    const fileArray = Array.from(selectedFiles)
    
    // Validar número máximo de archivos
    if (files.length + fileArray.length > maxFiles) {
      onError?.(`Máximo ${maxFiles} archivos permitidos`)
      return
    }

    // Validar cada archivo
    const validationErrors: string[] = []
    fileArray.forEach(file => {
      const error = validateFile(file)
      if (error) validationErrors.push(error)
    })

    if (validationErrors.length > 0) {
      onError?.(validationErrors.join(', '))
      return
    }

    setUploading(true)

    try {
      const uploadPromises = fileArray.map(file => uploadToCloudinary(file))
      const uploadedFiles = await Promise.all(uploadPromises)
      
      const newFiles = [...files, ...uploadedFiles]
      setFiles(newFiles)
      onFilesUploaded?.(uploadedFiles)
    } catch (error) {
      onError?.(error instanceof Error ? error.message : 'Error al subir archivos')
    } finally {
      setUploading(false)
    }
  }, [files, maxFiles, onError, onFilesUploaded, uploadToCloudinary, validateFile])

  // Función para remover archivo
  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter(file => file.id !== fileId)
    setFiles(updatedFiles)
    onFileRemoved?.(fileId)
  }

  // Handlers para drag & drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }, [])

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  // Handler para input de archivo
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files)
    }
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <div
          className={`
            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}
            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            {uploading ? 'Subiendo...' : 'Arrastra archivos o haz clic'}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={acceptedTypes.join(',')}
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-1">
            {files.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {getFileIcon(file.category, file.type)}
                  <span className="text-sm font-medium truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Zona de subida */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {uploading ? 'Subiendo archivos...' : 'Subir archivos'}
        </h3>
        <p className="text-gray-600 mb-2">
          Arrastra y suelta archivos aquí, o haz clic para seleccionar
        </p>
        <p className="text-sm text-gray-500">
          Máximo {maxFiles} archivos, {maxFileSize}MB cada uno
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Tipos permitidos: {acceptedTypes.join(', ')}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />
      </div>

      {/* Lista de archivos */}
      {files.length > 0 && showPreview && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">
            Archivos subidos ({files.length}/{maxFiles})
          </h4>
          <div className="grid gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-white border rounded-lg shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.category, file.type)}
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {
                        (() => {
                          try {
                            const date = file.uploadedAt instanceof Date ? file.uploadedAt : new Date(file.uploadedAt)
                            return isNaN(date.getTime()) ? 'Fecha no disponible' : date.toLocaleDateString()
                          } catch {
                            return 'Fecha no disponible'
                          }
                        })()
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {file.category === 'image' && (
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                      title="Ver imagen"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}