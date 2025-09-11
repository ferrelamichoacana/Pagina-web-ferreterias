'use client'

import React, { useState } from 'react'
import { useBranches } from '@/lib/hooks/useFirebaseData'
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
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'
import type { Branch } from '@/types'

export default function BranchesManager() {
  const { branches, loading, error } = useBranches()
  const [showForm, setShowForm] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    state: '',
    address: '',
    phone: '',
    email: '',
    schedule: '',
    coordinates: { lat: 0, lng: 0 },
    isMain: false,
    services: [] as string[]
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name === 'lat' || name === 'lng') {
      setFormData(prev => ({
        ...prev,
        coordinates: {
          ...prev.coordinates,
          [name]: parseFloat(value) || 0
        }
      }))
    } else if (type === 'checkbox') {
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

  const handleServicesChange = (service: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      services: checked 
        ? [...prev.services, service]
        : prev.services.filter(s => s !== service)
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      city: '',
      state: '',
      address: '',
      phone: '',
      email: '',
      schedule: '',
      coordinates: { lat: 0, lng: 0 },
      isMain: false,
      services: []
    })
    setEditingBranch(null)
    setShowForm(false)
  }

  const handleEdit = (branch: Branch) => {
    setFormData({
      name: branch.name,
      city: branch.city,
      state: branch.state,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      schedule: branch.schedule,
      coordinates: branch.coordinates || { lat: 0, lng: 0 },
      isMain: branch.isMain || false,
      services: branch.services || []
    })
    setEditingBranch(branch)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingBranch) {
        // Actualizar sucursal existente
        await updateDoc(doc(db, 'branches', editingBranch.id), {
          ...formData,
          updatedAt: serverTimestamp()
        })
      } else {
        // Crear nueva sucursal
        await addDoc(collection(db, 'branches'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
      
      resetForm()
    } catch (error) {
      console.error('Error saving branch:', error)
      alert('Error al guardar la sucursal')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (branchId: string, branchName: string) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la sucursal "${branchName}"?`)) {
      try {
        await deleteDoc(doc(db, 'branches', branchId))
      } catch (error) {
        console.error('Error deleting branch:', error)
        alert('Error al eliminar la sucursal')
      }
    }
  }

  const availableServices = [
    'Venta al público',
    'Venta mayorista',
    'Entrega a domicilio',
    'Asesoría técnica',
    'Instalación',
    'Servicio técnico',
    'Capacitación'
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
          Gestión de Sucursales
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Agregar Sucursal</span>
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
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingBranch ? 'Editar Sucursal' : 'Nueva Sucursal'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Sucursal *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ej. Sucursal Morelia Centro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ej. Morelia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ej. Michoacán"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ej. (443) 123-4567"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ej. Av. Madero #123, Centro Histórico"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="sucursal@ferreterialamichoacana.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Horario
                </label>
                <input
                  type="text"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitud
                </label>
                <input
                  type="number"
                  name="lat"
                  value={formData.coordinates.lat}
                  onChange={handleInputChange}
                  step="any"
                  className="input-field"
                  placeholder="19.7026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitud
                </label>
                <input
                  type="number"
                  name="lng"
                  value={formData.coordinates.lng}
                  onChange={handleInputChange}
                  step="any"
                  className="input-field"
                  placeholder="-101.1947"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isMain"
                  checked={formData.isMain}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Sucursal Principal</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Servicios Disponibles
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableServices.map(service => (
                  <label key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service)}
                      onChange={(e) => handleServicesChange(service, e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Guardando...' : (editingBranch ? 'Actualizar' : 'Crear')}
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

      {/* Lista de sucursales */}
      <div className="space-y-4">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-white border rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {branch.name}
                  </h3>
                  {branch.isMain && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Principal
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{branch.address}, {branch.city}, {branch.state}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{branch.phone}</span>
                  </div>
                  
                  {branch.email && (
                    <div className="flex items-center space-x-2">
                      <EnvelopeIcon className="h-4 w-4" />
                      <span>{branch.email}</span>
                    </div>
                  )}
                  
                  {branch.schedule && (
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4" />
                      <span>{branch.schedule}</span>
                    </div>
                  )}
                </div>

                {branch.services && branch.services.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {branch.services.map(service => (
                        <span
                          key={service}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(branch)}
                  className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                  title="Editar"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(branch.id, branch.name)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Eliminar"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {branches.length === 0 && (
        <div className="text-center py-12">
          <BuildingStorefrontIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay sucursales registradas</p>
        </div>
      )}
    </div>
  )
}