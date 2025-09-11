'use client'

import React, { useState, useCallback } from 'react'
import { useBrands } from '@/lib/hooks/useFirebaseData'
import { uploadWithPreset } from '@/lib/utils/cloudinary'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'
import type { Brand } from '@/types'

export default function BrandsManager() {
  const { brands, loading, error } = useBrands()
  
  // Datos mock como fallback
  const mockBrands = [
    {
      id: '1',
      name: 'CEMEX',
      logoUrl: '/images/brands/cemex.png',
      category: 'Cemento',
      description: 'Líder mundial en materiales de construcción',
      website: 'https://cemex.com',
      active: true
    },
    {
      id: '2', 
      name: 'DeWalt',
      logoUrl: '/images/brands/dewalt.png',
      category: 'Herramientas',
      description: 'Herramientas profesionales de alta calidad',
      website: 'https://dewalt.com',
      active: true
    }
  ]
  
  // Usar datos mock si hay error o no hay datos
  const displayBrands = error || !brands?.length ? mockBrands : brands
  const [showForm, setShowForm] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    category: '',
    description: '',
    website: '',
    active: true
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      logoUrl: '',
      category: '',
      description: '',
      website: '',
      active: true
    })
    setEditingBrand(null)
    setShowForm(false)
  }

  const handleEdit = (brand: Brand) => {
    setFormData({
      name: brand.name,
      logoUrl: brand.logoUrl,
      category: brand.category,
      description: brand.description || '',
      website: brand.website || '',
      active: brand.active
    })
    setEditingBrand(brand)
    setShowForm(true)
  }

  // Función para manejar la subida de archivos
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (PNG, JPG, WEBP)')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('El archivo es muy grande. Máximo 5MB permitido.')
      return
    }

    setUploadingImage(true)
    
    try {
      const result = await uploadWithPreset(file, 'brandLogo', 'ferreteria-la-michoacana/brands')
      
      if (result.success) {
        setFormData(prev => ({
          ...prev,
          logoUrl: result.url
        }))
      } else {
        alert('Error al subir la imagen: ' + result.error)
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error al subir la imagen')
    } finally {
      setUploadingImage(false)
    }
  }

  // Drag and Drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category) {
      alert('Por favor completa los campos requeridos')
      return
    }

    setIsSubmitting(true)

    try {
      if (editingBrand) {
        // Actualizar marca existente
        await updateDoc(doc(db, 'brands', editingBrand.id), {
          ...formData,
          updatedAt: serverTimestamp()
        })
      } else {
        // Crear nueva marca
        await addDoc(collection(db, 'brands'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
      
      resetForm()
    } catch (error) {
      console.error('Error saving brand:', error)
      alert('Error al guardar la marca')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (brandId: string, brandName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la marca "${brandName}"?`)) {
      try {
        await deleteDoc(doc(db, 'brands', brandId))
      } catch (error) {
        console.error('Error deleting brand:', error)
        alert('Error al eliminar la marca')
      }
    }
  }

  const toggleActive = async (brand: Brand) => {
    try {
      await updateDoc(doc(db, 'brands', brand.id), {
        active: !brand.active,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating brand status:', error)
      alert('Error al actualizar el estado de la marca')
    }
  }

  const categories = [
    'Herramientas Eléctricas',
    'Herramientas Manuales',
    'Material Eléctrico',
    'Plomería',
    'Materiales de Construcción',
    'Ferretería General',
    'Pinturas y Barnices',
    'Tornillería',
    'Seguridad Industrial',
    'Jardinería',
    'Otro'
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Gestión de Marcas
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Agregar Marca</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingBrand ? 'Editar Marca' : 'Nueva Marca'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subida de logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo de la Marca
              </label>
              
              {/* Área de drag & drop */}
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                {uploadingImage ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-2"></div>
                    <p className="text-sm text-gray-600">Subiendo imagen...</p>
                  </div>
                ) : formData.logoUrl ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-24 h-24 mb-4">
                      <Image
                        src={formData.logoUrl}
                        alt="Logo preview"
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <p className="text-sm text-green-600 mb-2">✓ Logo cargado correctamente</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, logoUrl: '' }))}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Eliminar logo
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Arrastra y suelta una imagen aquí, o{' '}
                      <label className="text-primary-600 hover:text-primary-700 cursor-pointer">
                        selecciona un archivo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, WEBP hasta 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Marca *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ej. DeWalt"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Descripción breve de la marca..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sitio Web
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://www.marca.com"
                />
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Marca activa</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting || uploadingImage}
                className="btn-primary"
              >
                {isSubmitting ? 'Guardando...' : (editingBrand ? 'Actualizar' : 'Crear')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de marcas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayBrands.map((brand) => (
          <div key={brand.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  brand.active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {brand.active ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(brand)}
                  className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Editar"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleActive(brand)}
                  className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                  title={brand.active ? 'Desactivar' : 'Activar'}
                >
                  <PhotoIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(brand.id, brand.name)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Eliminar"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="aspect-square relative mb-3 bg-gray-50 rounded-lg">
              {brand.logoUrl ? (
                <Image
                  src={brand.logoUrl}
                  alt={`Logo de ${brand.name}`}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <PhotoIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-1">{brand.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{brand.category}</p>
              {brand.description && (
                <p className="text-xs text-gray-400 line-clamp-2">{brand.description}</p>
              )}
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary-600 hover:text-primary-700 mt-2 inline-block"
                >
                  Visitar sitio web
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayBrands.length === 0 && (
        <div className="text-center py-12">
          <PhotoIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay marcas registradas</p>
        </div>
      )}
    </div>
  )
}