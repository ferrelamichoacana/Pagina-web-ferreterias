'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useFileManager } from '@/lib/hooks/useFileManager'
import FileManager from '@/components/files/FileManager'
import { 
  FolderOpen, 
  HardDrive, 
  Users, 
  FileText, 
  Image, 
  Download,
  Trash2,
  Search,
  Filter,
  Calendar,
  BarChart3
} from 'lucide-react'

export default function FileManagementPage() {
  const { user } = useAuth()
  const { files, loading, getFileStats, fetchFiles } = useFileManager()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [dateRange, setDateRange] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Cargar todos los archivos para administradores
    let unsubscribe: (() => void) | undefined
    
    fetchFiles({}).then((unsub) => {
      unsubscribe = unsub
    })
    
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [fetchFiles])

  const stats = getFileStats()

  // Filtrar archivos según criterios
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory
    const matchesType = selectedType === 'all' || file.relatedType === selectedType
    
    let matchesDate = true
    if (dateRange !== 'all') {
      const now = new Date()
      const fileDate = new Date(file.uploadedAt)
      
      switch (dateRange) {
        case 'today':
          matchesDate = fileDate.toDateString() === now.toDateString()
          break
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          matchesDate = fileDate >= weekAgo
          break
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          matchesDate = fileDate >= monthAgo
          break
      }
    }
    
    return matchesSearch && matchesCategory && matchesType && matchesDate
  })

  // Calcular estadísticas por tipo de relación
  const statsByType = files.reduce((acc, file) => {
    const type = file.relatedType || 'other'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calcular uso de almacenamiento
  const totalSizeGB = stats.totalSize / (1024 * 1024 * 1024)
  const storageLimit = 10 // GB - límite ejemplo
  const storageUsagePercent = (totalSizeGB / storageLimit) * 100

  if (loading && files.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2 text-gray-600">Cargando archivos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Archivos</h1>
          <p className="text-gray-600">Administración centralizada de todos los archivos del sistema</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <HardDrive className="w-4 h-4" />
          <span>{totalSizeGB.toFixed(2)} GB / {storageLimit} GB</span>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FolderOpen className="w-8 h-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Archivos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <HardDrive className="w-8 h-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Almacenamiento</p>
              <p className="text-2xl font-bold text-gray-900">{totalSizeGB.toFixed(1)} GB</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${storageUsagePercent > 80 ? 'bg-red-500' : storageUsagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min(storageUsagePercent, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Image className="w-8 h-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Imágenes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byCategory.image || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documentos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.byCategory.document || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas por tipo de relación */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Archivos por Módulo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Object.entries(statsByType).map(([type, count]) => (
            <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 capitalize">
                {type === 'contact' ? 'Contactos' :
                 type === 'job_application' ? 'Empleos' :
                 type === 'quotation' ? 'Cotizaciones' :
                 type === 'ticket' ? 'Tickets IT' :
                 type === 'user_profile' ? 'Perfiles' : 'Otros'}
              </p>
              <p className="text-xl font-bold text-gray-900">{count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar archivos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todas las categorías</option>
              <option value="image">Imágenes</option>
              <option value="document">Documentos</option>
              <option value="other">Otros</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Módulo</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todos los módulos</option>
              <option value="contact">Contactos</option>
              <option value="job_application">Empleos</option>
              <option value="quotation">Cotizaciones</option>
              <option value="ticket">Tickets IT</option>
              <option value="user_profile">Perfiles</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
            </select>
          </div>
        </div>

        {/* Resultados de filtros */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {filteredFiles.length} de {files.length} archivos
          </p>
          {(searchTerm || selectedCategory !== 'all' || selectedType !== 'all' || dateRange !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
                setSelectedType('all')
                setDateRange('all')
              }}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Gestión de archivos */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            Todos los Archivos
          </h3>
        </div>
        <div className="p-6">
          <FileManager
            userId={user?.uid}
            maxFiles={20}
            maxFileSize={50}
            acceptedTypes={['*']}
            allowUpload={true}
            allowDelete={true}
            allowEdit={true}
            viewMode="list"
            compact={false}
          />
        </div>
      </div>

      {/* Acciones de administración */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acciones de Administración</h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            <span>Exportar Lista</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
            <HardDrive className="w-4 h-4" />
            <span>Limpiar Cache</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
            <Trash2 className="w-4 h-4" />
            <span>Limpiar Archivos Huérfanos</span>
          </button>
        </div>
      </div>
    </div>
  )
}