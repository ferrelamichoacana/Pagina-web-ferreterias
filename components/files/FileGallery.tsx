'use client'

import React, { useState, useEffect } from 'react'
import { useFileManager, FileRecord } from '@/lib/hooks/useFileManager'
import { 
  Image, 
  FileText, 
  File, 
  Download, 
  Eye, 
  Trash2, 
  Edit3, 
  Tag,
  Calendar,
  User,
  Search,
  Filter,
  Grid,
  List
} from 'lucide-react'

interface FileGalleryProps {
  userId?: string
  relatedTo?: string
  relatedType?: string
  showUploader?: boolean
  allowDelete?: boolean
  allowEdit?: boolean
  viewMode?: 'grid' | 'list'
  showFilters?: boolean
}

export default function FileGallery({
  userId,
  relatedTo,
  relatedType,
  showUploader = false,
  allowDelete = true,
  allowEdit = true,
  viewMode: initialViewMode = 'grid',
  showFilters = true
}: FileGalleryProps) {
  const { files, loading, error, fetchFiles, deleteFile, updateFileMetadata } = useFileManager({
    userId,
    relatedTo,
    relatedType
  })

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(initialViewMode)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editingFile, setEditingFile] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ description: '', tags: '' })

  // Cargar archivos al montar el componente
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    
    fetchFiles({
      userId,
      relatedTo,
      relatedType,
      category: categoryFilter !== 'all' ? categoryFilter : undefined
    }).then((unsub) => {
      unsubscribe = unsub
    })

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [fetchFiles, userId, relatedTo, relatedType, categoryFilter])

  // Filtrar archivos por búsqueda
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || file.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Función para obtener el icono del archivo
  const getFileIcon = (file: FileRecord) => {
    const iconClass = "w-8 h-8"
    switch (file.category) {
      case 'image':
        return <Image className={`${iconClass} text-blue-500`} aria-label="Archivo de imagen" />
      case 'document':
        if (file.type.includes('pdf')) {
          return <FileText className={`${iconClass} text-red-500`} />
        }
        return <FileText className={`${iconClass} text-blue-500`} />
      default:
        return <File className={`${iconClass} text-gray-500`} />
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

  // Función para manejar la eliminación
  const handleDelete = async (file: FileRecord) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar "${file.name}"?`)) {
      await deleteFile(file.id, file.cloudinaryId)
    }
  }

  // Función para iniciar edición
  const startEdit = (file: FileRecord) => {
    setEditingFile(file.id)
    setEditForm({
      description: file.description || '',
      tags: file.tags?.join(', ') || ''
    })
  }

  // Función para guardar edición
  const saveEdit = async () => {
    if (!editingFile) return

    const tags = editForm.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    await updateFileMetadata(editingFile, {
      description: editForm.description,
      tags
    })

    setEditingFile(null)
    setEditForm({ description: '', tags: '' })
  }

  // Función para cancelar edición
  const cancelEdit = () => {
    setEditingFile(null)
    setEditForm({ description: '', tags: '' })
  }

  if (loading && files.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Cargando archivos...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles superiores */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Búsqueda y filtros */}
          <div className="flex flex-1 gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar archivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
              />
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="image">Imágenes</option>
              <option value="document">Documentos</option>
              <option value="other">Otros</option>
            </select>
          </div>

          {/* Controles de vista */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Estadísticas */}
      {filteredFiles.length > 0 && (
        <div className="text-sm text-gray-600">
          Mostrando {filteredFiles.length} de {files.length} archivos
        </div>
      )}

      {/* Lista/Grid de archivos */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-8">
          <File className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm || categoryFilter !== 'all' 
              ? 'No se encontraron archivos con los filtros aplicados'
              : 'No hay archivos disponibles'
            }
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              {/* Preview del archivo */}
              <div className="p-4 text-center">
                {file.category === 'image' ? (
                  <img
                    src={file.url}
                    alt={file.name}
                    className="w-full h-32 object-cover rounded mb-2"
                  />
                ) : (
                  <div className="flex justify-center mb-2">
                    {getFileIcon(file)}
                  </div>
                )}
                
                <h3 className="font-medium text-sm text-gray-900 truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {formatFileSize(file.size)}
                </p>
              </div>

              {/* Metadatos */}
              <div className="px-4 pb-2">
                {file.description && (
                  <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                    {file.description}
                  </p>
                )}
                {file.tags && file.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {file.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {file.tags.length > 2 && (
                      <span className="text-xs text-gray-400">+{file.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex items-center justify-between p-3 border-t bg-gray-50">
                <div className="flex items-center space-x-1">
                  {file.category === 'image' && (
                    <button
                      onClick={() => window.open(file.url, '_blank')}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Ver imagen"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                    title="Descargar"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-1">
                  {allowEdit && (
                    <button
                      onClick={() => startEdit(file)}
                      className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {allowDelete && (
                    <button
                      onClick={() => handleDelete(file)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div key={file.id} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{file.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{formatFileSize(file.size)}</span>
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {file.uploadedAt.toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        {file.uploadedBy}
                      </span>
                    </div>
                    {file.description && (
                      <p className="text-sm text-gray-600 mt-1">{file.description}</p>
                    )}
                    {file.tags && file.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {file.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
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
                  {allowEdit && (
                    <button
                      onClick={() => startEdit(file)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                      title="Editar"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                  {allowDelete && (
                    <button
                      onClick={() => handleDelete(file)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Editar archivo</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Descripción del archivo..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Etiquetas (separadas por comas)
                </label>
                <input
                  type="text"
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="etiqueta1, etiqueta2, etiqueta3"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}