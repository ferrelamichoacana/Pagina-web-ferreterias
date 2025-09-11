'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { updateUserProfile, getUserProfile } from '@/lib/utils/firestore'
import { useBranches } from '@/lib/hooks/useFirebaseData'
import { UserIcon, BuildingOfficeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline'

interface UserProfile {
  displayName: string
  email: string
  phone: string
  company: string
  position: string
  branchId: string
  location: string
  bio: string
}

export default function ProfileEditor() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { branches, loading: branchesLoading } = useBranches()
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    branchId: '',
    location: '',
    bio: ''
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Cargar perfil del usuario
  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.uid) return
      
      try {
        const userProfile = await getUserProfile(user.uid) as any
        if (userProfile) {
          setProfile({
            displayName: userProfile.displayName || '',
            email: userProfile.email || '',
            phone: userProfile.phone || '',
            company: userProfile.company || '',
            position: userProfile.position || '',
            branchId: userProfile.branchId || '',
            location: userProfile.location || '',
            bio: userProfile.bio || ''
          })
        }
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.uid) return

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      await updateUserProfile(user.uid, profile)
      setSaveStatus('success')
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon className="h-10 w-10 text-primary-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Editar Perfil
        </h2>
        <p className="text-gray-600">
          Actualiza tu información personal y de contacto
        </p>
      </div>

      {saveStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-center font-medium">
            ✓ Perfil actualizado correctamente
          </p>
        </div>
      )}

      {saveStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-center font-medium">
            ✗ Error al actualizar el perfil. Inténtalo de nuevo.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
            Información Personal
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={profile.displayName}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Ej. Juan Pérez García"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                required
                disabled
                className="input-field bg-gray-50 cursor-not-allowed"
                title="El email no se puede cambiar"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="h-4 w-4 inline mr-1" />
              Teléfono
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={profile.phone}
              onChange={handleInputChange}
              className="input-field"
              placeholder="(443) 123-4567"
            />
          </div>
        </div>

        {/* Información profesional */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BuildingOfficeIcon className="h-5 w-5 mr-2 text-primary-600" />
            Información Profesional
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa/Organización
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={profile.company}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej. Constructora ABC"
              />
            </div>

            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-2">
                Cargo/Posición
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={profile.position}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej. Gerente de Proyectos"
              />
            </div>
          </div>
        </div>

        {/* Ubicación */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPinIcon className="h-5 w-5 mr-2 text-primary-600" />
            Ubicación
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad/Ubicación
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej. Morelia, Michoacán"
              />
            </div>

            <div>
              <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-2">
                Sucursal Preferida
              </label>
              <select
                id="branchId"
                name="branchId"
                value={profile.branchId}
                onChange={handleInputChange}
                className="input-field"
                disabled={branchesLoading}
              >
                <option value="">{branchesLoading ? 'Cargando sucursales...' : 'Seleccionar sucursal'}</option>
                {branches?.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}, {branch.state}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Biografía */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
            Acerca de ti (Opcional)
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profile.bio}
            onChange={handleInputChange}
            rows={4}
            className="input-field resize-none"
            placeholder="Cuéntanos un poco sobre ti, tu experiencia o intereses..."
          />
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex-1 btn-primary py-3 text-lg font-medium ${
              isSaving ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 btn-secondary py-3 text-lg font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Nota sobre privacidad */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Tu información personal está protegida y solo será utilizada para mejorar tu experiencia en nuestros servicios.
        </p>
      </div>
    </div>
  )
}