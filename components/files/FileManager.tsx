'use client'

import React, { useState } from 'react'
import FileUploader from '@/components/ui/FileUploader'
import FileGallery from '@/components/files/FileGallery'
import { useFileManager } from '@/lib/hooks/useFileManager'
import { Upload, FolderOpen, Plus, X } from 'lucide-react'

interface FileManagerProps {
  // Configuración de contexto
  userId?: string
  relatedTo?: string
  relatedType?: 'contact' | 'job_application' | 'quotation' | 'ticket' | 'user_profile'
  
  // Configuración de uploader
  maxFiles?: number
  maxFileSize?: number
  acceptedTypes?: string[]
  
  // Configuración de permisos
  allowUpload?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  
  // Configuración visual
  showUploader?: boolean
  viewMode?: 'grid' | 'list'
  compact?: boolean
  
  // Metadatos adicionales
  description?: string
  tags?: string[]
  isPublic?: boolean
}

export default function FileManager({
  userId,
  relatedTo,
  relatedType,
  maxFiles = 10,
  maxFileSize = 10,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  allowUpload = true,
  allowDelete = true,
  allowEdit = true,
  showUploader: initialShowUploader = false,
  viewMode = 'grid',
  compact = false,
  description,
  tags,
  isPublic = false
}: FileManagerProps) {
  const [showUploader, setShowUploader] = useState(initialShowUploader)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { uploadFiles, getFileStats } = useFileManager({
    userId,
    relatedTo,
    relatedType
  })

  // Función para manejar la subida de archivos
  const handleFilesUploaded = async (files: any[]) => {
    try {
      setUploading(true)
      setError(null)

      // Convertir los archivos del uploader al formato esperado
      const fileObjects = files.map(file => {
        // Crear un objeto File desde los datos del uploader
        const blob = new Blob([''], { type: file.type })
        const fileObj = new File([blob], file.name, { type: file.type })
        
        // Agregar propiedades adicionales
        Object.defineProperty(fileObj, 'size', { value: file.size })
        
        return fileObj
      })

      await uploadFiles(fileObjects, {
        relatedTo,
        relatedType,
        description,
        tags,
        isPublic
      })

      setShowUploader(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivos')
    } finally {
      setUploading(false)
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
  }

  const stats = getFileStats()

  if (compact) {
    return (
      <div className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {allowUpload && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {stats.totalFiles} archivos ({(stats.totalSize / 1024 / 1024).toFixed(1)} MB)
            </div>
            <button
              onClick={() => setShowUploader(!showUploader)}
              className="flex items-center space-x-2 px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              disabled={uploading}
            >
              {showUploader ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showUploader ? 'Cancelar' : 'Subir'}</span>
            </button>
          </div>
        )}

        {showUploader && (
          <FileUploader
            maxFiles={maxFiles}
            maxFileSize={maxFileSize}
            acceptedTypes={acceptedTypes}
            onFilesUploaded={handleFilesUploaded}
            onError={handleError}
            compact={true}
            multiple={true}
          />
        )}

        <FileGallery
          userId={userId}
          relatedTo={relatedTo}
          relatedType={relatedType}
          allowDelete={allowDelete}
          allowEdit={allowEdit}
          viewMode={viewMode}
          showFilters={false}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <FolderOpen className="w-6 h-6 text-gray-400" />
          <div>
            <h2 className="text-lg font-medium text-gray-900">Gestión de Archivos</h2>
            <p className="text-sm text-gray-600">
              {stats.totalFiles} archivos • {(stats.totalSize / 1024 / 1024).toFixed(1)} MB total
            </p>
          </div>
        </div>

        {allowUpload && (
          <button
            onClick={() => setShowUploader(!showUploader)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            disabled={uploading}
          >
            {showUploader ? (
              <>
                <X className="w-4 h-4" />
                <span>Cancelar subida</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Subir archivos</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Mensajes de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <X className="w-5 h-5 text-red-400 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Estadísticas por categoría */}
      {stats.totalFiles > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Upload className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-900">Imágenes</p>
                <p className="text-lg font-bold text-blue-600">
                  {stats.byCategory.image || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FolderOpen className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-green-900">Documentos</p>
                <p className="text-lg font-bold text-green-600">
                  {stats.byCategory.document || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <Upload className="w-5 h-5 text-gray-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Otros</p>
                <p className="text-lg font-bold text-gray-600">
                  {stats.byCategory.other || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploader */}
      {showUploader && (
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Subir nuevos archivos</h3>
          <FileUploader
            maxFiles={maxFiles}
            maxFileSize={maxFileSize}
            acceptedTypes={acceptedTypes}
            onFilesUploaded={handleFilesUploaded}
            onError={handleError}
            multiple={true}
            showPreview={true}
          />
        </div>
      )}

      {/* Galería de archivos */}
      <div className="bg-white border rounded-lg p-6">
        <FileGallery
          userId={userId}
          relatedTo={relatedTo}
          relatedType={relatedType}
          allowDelete={allowDelete}
          allowEdit={allowEdit}
          viewMode={viewMode}
          showFilters={true}
        />
      </div>
    </div>
  )
}