'use client'

import React, { useState } from 'react'
import { useSocialWidgets } from '@/lib/hooks/useFirebaseData'
import { SocialWidget } from '@/types'
import { PlusIcon, TrashIcon, EyeIcon, EyeSlashIcon, PencilIcon } from '@heroicons/react/24/outline'

export default function SocialWidgetsManager() {
  const { widgets, loading, error } = useSocialWidgets()
  const [isEditing, setIsEditing] = useState(false)
  const [editingWidget, setEditingWidget] = useState<SocialWidget | null>(null)
  const [newWidget, setNewWidget] = useState({
    type: 'reel' as 'facebook' | 'instagram' | 'reel',
    url: '',
    iframeCode: '',
    position: 1,
    active: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingWidget) {
        // Actualizar widget existente
        const response = await fetch('/api/social-widgets', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: editingWidget.id,
            ...newWidget
          })
        })

        if (response.ok) {
          setEditingWidget(null)
          setNewWidget({
            type: 'reel',
            url: '',
            iframeCode: '',
            position: 1,
            active: true
          })
          setIsEditing(false)
        } else {
          const errorData = await response.json()
          alert(`Error: ${errorData.error}`)
        }
      } else {
        // Crear nuevo widget
        const response = await fetch('/api/social-widgets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newWidget)
        })

        if (response.ok) {
          setNewWidget({
            type: 'reel',
            url: '',
            iframeCode: '',
            position: 1,
            active: true
          })
          setIsEditing(false)
        } else {
          const errorData = await response.json()
          alert(`Error: ${errorData.error}`)
        }
      }
    } catch (error) {
      alert('Error al guardar el widget')
    }
  }

  const startEdit = (widget: SocialWidget) => {
    setEditingWidget(widget)
    setNewWidget({
      type: widget.type,
      url: widget.url,
      iframeCode: widget.iframeCode || '',
      position: widget.position,
      active: widget.active
    })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setEditingWidget(null)
    setNewWidget({
      type: 'reel',
      url: '',
      iframeCode: '',
      position: 1,
      active: true
    })
    setIsEditing(false)
  }

  const toggleActive = async (widget: SocialWidget) => {
    try {
      const response = await fetch('/api/social-widgets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: widget.id,
          active: !widget.active
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      alert('Error al actualizar el widget')
    }
  }

  const deleteWidget = async (widgetId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este widget?')) {
      return
    }

    try {
      const response = await fetch(`/api/social-widgets?id=${widgetId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      alert('Error al eliminar el widget')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2">Cargando widgets sociales...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error al cargar widgets: {error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Reels Sociales</h2>
          <p className="text-gray-600">Gestiona los reels y videos que aparecen en el carrusel de la página principal</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Agregar Reel</span>
        </button>
      </div>

      {/* Formulario de creación/edición */}
      {isEditing && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingWidget ? 'Editar Reel' : 'Nuevo Reel'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Contenido
                </label>
                <select
                  value={newWidget.type}
                  onChange={(e) => setNewWidget({ ...newWidget, type: e.target.value as 'facebook' | 'instagram' | 'reel' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="reel">Reel/Video (Iframe)</option>
                  <option value="facebook">Facebook (URL)</option>
                  <option value="instagram">Instagram (URL)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición
                </label>
                <input
                  type="number"
                  min="1"
                  value={newWidget.position}
                  onChange={(e) => setNewWidget({ ...newWidget, position: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Campo para URL (para tipos facebook e instagram) */}
            {(newWidget.type === 'facebook' || newWidget.type === 'instagram') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL del Post/Reel
                </label>
                <input
                  type="url"
                  value={newWidget.url}
                  onChange={(e) => setNewWidget({ ...newWidget, url: e.target.value })}
                  placeholder="https://www.facebook.com/reel/... o https://www.instagram.com/p/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL directa del post o reel de {newWidget.type === 'facebook' ? 'Facebook' : 'Instagram'}
                </p>
              </div>
            )}

            {/* Campo para código iframe (para tipo reel) */}
            {newWidget.type === 'reel' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código Iframe Completo
                </label>
                <textarea
                  value={newWidget.iframeCode}
                  onChange={(e) => setNewWidget({ ...newWidget, iframeCode: e.target.value })}
                  placeholder='<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=..." width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>'
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Pega aquí el código iframe completo de Facebook. Para obtenerlo: Ve al reel → "..." → "Insertar" → copia todo el código
                </p>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                checked={newWidget.active}
                onChange={(e) => setNewWidget({ ...newWidget, active: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                Activo
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                {editingWidget ? 'Actualizar Reel' : 'Crear Reel'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de widgets */}
      <div className="space-y-4">
        {widgets && widgets.length > 0 ? (
          widgets.map((widget) => (
            <div key={widget.id} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {widget.type}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Posición {widget.position}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      widget.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {widget.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2 truncate">
                    {widget.url}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleActive(widget)}
                    className={`p-2 rounded-lg ${
                      widget.active 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={widget.active ? 'Desactivar' : 'Activar'}
                  >
                    {widget.active ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => startEdit(widget)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Editar"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  
                  <button
                    onClick={() => deleteWidget(widget.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Eliminar"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay widgets configurados</p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              Crear el primer widget
            </button>
          </div>
        )}
      </div>

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Consejos de uso</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Los reels aparecen en una sección horizontal con scroll debajo de promociones</li>
          <li>• <strong>Tipo "Reel/Video (Iframe)"</strong>: Para insertar código iframe completo de Facebook</li>
          <li>• <strong>Tipo "Facebook/Instagram (URL)"</strong>: Para URLs directas que se convierten automáticamente</li>
          <li>• Para obtener iframe: Ve al reel → "..." → "Insertar" → copia todo el código</li>
          <li>• El carrusel permite scroll horizontal para ver todos los reels</li>
          <li>• Los reels se ordenan por posición (menor número = más a la izquierda)</li>
        </ul>
      </div>
    </div>
  )
}
