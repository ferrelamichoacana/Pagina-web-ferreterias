'use client'

import React, { useState } from 'react'
import { useUsers, useBranches } from '@/lib/hooks/useFirebaseData'
import { 
  updateDoc, 
  doc, 
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { 
  UsersIcon,
  PencilIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'
import type { User, UserRole } from '@/types'

export default function UsersManager() {
  const { users, loading, error } = useUsers()
  const { branches } = useBranches()
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    displayName: '',
    role: 'cliente' as UserRole,
    branchId: '',
    phone: '',
    companyName: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEdit = (user: User) => {
    setFormData({
      displayName: user.displayName || '',
      role: user.role,
      branchId: user.branchId || '',
      phone: user.phone || '',
      companyName: user.companyName || ''
    })
    setEditingUser(user)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingUser) return

    setIsSubmitting(true)

    try {
      await updateDoc(doc(db, 'users', editingUser.uid), {
        ...formData,
        updatedAt: serverTimestamp()
      })
      
      setEditingUser(null)
      setFormData({
        displayName: '',
        role: 'cliente',
        branchId: '',
        phone: '',
        companyName: ''
      })
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar el usuario')
    } finally {
      setIsSubmitting(false)
    }
  }

  const roleLabels: Record<UserRole, string> = {
    cliente: 'Cliente',
    vendedor: 'Vendedor',
    gerente: 'Gerente',
    rrhh: 'RRHH',
    it: 'IT',
    admin: 'Administrador'
  }

  const roleColors: Record<UserRole, string> = {
    cliente: 'bg-blue-100 text-blue-800',
    vendedor: 'bg-green-100 text-green-800',
    gerente: 'bg-purple-100 text-purple-800',
    rrhh: 'bg-yellow-100 text-yellow-800',
    it: 'bg-red-100 text-red-800',
    admin: 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          Gestión de Usuarios
        </h2>
        <div className="text-sm text-gray-500">
          Total: {users.length} usuarios
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      {/* Formulario de edición */}
      {editingUser && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Editar Usuario: {editingUser.email}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Nombre completo del usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol del Usuario
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  {Object.entries(roleLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {(formData.role === 'vendedor' || formData.role === 'gerente') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sucursal Asignada
                  </label>
                  <select
                    name="branchId"
                    value={formData.branchId}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Seleccionar sucursal</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name} - {branch.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="(443) 123-4567"
                />
              </div>

              {formData.role === 'cliente' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Nombre de la empresa del cliente"
                  />
                </div>
              )}
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Guardando...' : 'Actualizar Usuario'}
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Estadísticas por rol */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(roleLabels).map(([role, label]) => {
          const count = users.filter(user => user.role === role).length
          return (
            <div key={role} className="bg-white rounded-lg p-4 border">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600">{label}s</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Lista de Usuarios</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {users.map((user) => {
            const userBranch = branches.find(b => b.id === user.branchId)
            
            return (
              <div key={user.uid} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UsersIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.displayName || 'Sin nombre'}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                          {roleLabels[user.role]}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center text-sm text-gray-500">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                        
                        {user.phone && (
                          <div className="flex items-center text-sm text-gray-500">
                            <PhoneIcon className="h-4 w-4 mr-1" />
                            {user.phone}
                          </div>
                        )}
                        
                        {userBranch && (
                          <div className="flex items-center text-sm text-gray-500">
                            <BuildingStorefrontIcon className="h-4 w-4 mr-1" />
                            {userBranch.name}
                          </div>
                        )}
                      </div>
                      
                      {user.companyName && (
                        <p className="text-sm text-gray-500 mt-1">
                          Empresa: {user.companyName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                      title="Editar usuario"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No hay usuarios registrados</p>
        </div>
      )}

      {/* Nota informativa */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <ShieldCheckIcon className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Nota sobre la gestión de usuarios:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Los usuarios se crean automáticamente cuando se registran en Firebase Authentication</li>
              <li>Aquí puedes editar roles, asignar sucursales y actualizar información de contacto</li>
              <li>Para crear nuevos usuarios, deben registrarse primero en la aplicación</li>
              <li>Los cambios de rol se aplican inmediatamente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}