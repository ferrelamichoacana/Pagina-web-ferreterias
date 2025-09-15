'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { usePromotionsAdmin } from '@/lib/hooks/usePromotions'
import { Promotion } from '@/types'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  CalendarIcon,
  ArrowsUpDownIcon
} from '@heroicons/react/24/outline'
import Image from 'next/image'

export default function PromotionsManager() {
  const { user } = useAuth()
  const [authToken, setAuthToken] = useState<string>('')
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    contactInfo: '',
    startDate: '',
    endDate: '',
    active: true
  })

  // Obtener el token de Firebase cuando el usuario esté disponible
  React.useEffect(() => {
    if (user) {
      // Aquí deberías obtener el token de Firebase del usuario
      // Por ahora, simulamos que el token está disponible
      const getToken = async () => {
        try {
          // En una implementación real, obtendrías el token así:
          // const token = await user.getIdToken()
          // setAuthToken(token)
          
          // Por ahora, simulamos un token para testing
          setAuthToken('simulated-token')
        } catch (error) {
          console.error('Error getting auth token:', error)
        }
      }
      getToken()
    }
  }, [user])

  const {
    promotions,
    loading,
    error,
    refetch,
    createPromotion,
    updatePromotion,
    deletePromotion,
    reorderPromotions,
    creating,
    updating,
    deleting
  } = usePromotionsAdmin(authToken)

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      contactInfo: '',
      startDate: '',
      endDate: '',
      active: true
    })
    setSelectedPromotion(null)
    setIsEditing(false)
    setIsCreating(false)
  }

  const handleEdit = (promotion: Promotion) => {
    setSelectedPromotion(promotion)
    setFormData({
      title: promotion.title || '',
      description: promotion.description || '',
      imageUrl: promotion.imageUrl || '',
      contactInfo: promotion.contactInfo || '',
      startDate: new Date(promotion.startDate).toISOString().split('T')[0],
      endDate: new Date(promotion.endDate).toISOString().split('T')[0],
      active: promotion.active
    })
    setIsEditing(true)
  }

  const handleCreate = () => {
    resetForm()
    setIsCreating(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const promotionData = {
      ...formData,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate)
    }

    let success = false

    if (isEditing && selectedPromotion) {
      success = await updatePromotion(selectedPromotion.id!, promotionData)
    } else if (isCreating) {
      success = await createPromotion(promotionData)
    }

    if (success) {
      resetForm()
    }
  }

  const handleDelete = async (promotion: Promotion) => {
    if (!promotion.id) return
    
    const confirmed = window.confirm(`¿Estás seguro de eliminar la promoción "${promotion.title}"?`)
    if (confirmed) {
      await deletePromotion(promotion.id)
    }
  }

  const handleToggleActive = async (promotion: Promotion) => {
    if (!promotion.id) return
    
    const success = await updatePromotion(promotion.id, {
      active: !promotion.active
    })
    
    if (!success) {
      alert('Error al actualizar el estado de la promoción')
    }
  }

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('es-MX')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Promociones</h2>
          <p className="text-gray-600">Administra las promociones del carousel de la página principal</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="w-5 h-5" />
          Nueva Promoción
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Formulario de creación/edición */}
      {(isCreating || isEditing) && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? 'Editar Promoción' : 'Nueva Promoción'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Información de Contacto
              </label>
              <textarea
                value={formData.contactInfo}
                onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Información de contacto, términos y condiciones, etc."
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="active"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="active" className="text-sm font-medium text-gray-700">
                Promoción activa
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={creating || updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {creating || updating ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de promociones */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Promociones Existentes ({promotions.length})</h3>
        </div>
        
        {promotions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay promociones creadas aún.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {promotions.map((promotion) => (
              <div key={promotion.id} className="p-6 flex items-center gap-4">
                {/* Imagen */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                    {promotion.imageUrl ? (
                      <Image
                        src={promotion.imageUrl}
                        alt={promotion.title || 'Promoción'}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PhotoIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Información */}
                <div className="flex-grow min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 truncate">
                        {promotion.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {promotion.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                        </span>
                        <span className="flex items-center gap-1">
                          <ArrowsUpDownIcon className="w-4 h-4" />
                          Orden: {promotion.order}
                        </span>
                      </div>
                    </div>
                    
                    {/* Estado */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          promotion.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {promotion.active ? 'Activa' : 'Inactiva'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(promotion)}
                    className={`p-2 rounded-lg transition-colors ${
                      promotion.active
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={promotion.active ? 'Desactivar' : 'Activar'}
                  >
                    {promotion.active ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => handleEdit(promotion)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <PencilIcon className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(promotion)}
                    disabled={deleting}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}