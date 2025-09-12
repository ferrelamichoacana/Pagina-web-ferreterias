'use client'

import React, { useState, useEffect } from 'react'
import { useSystemConfig } from '@/lib/hooks/useFirebaseData'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { getFirestore } from '@/lib/firebase/utils'
import { 
  CogIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function SystemConfigManager() {
  const { config, loading, error } = useSystemConfig()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState('general')

  const [formData, setFormData] = useState({
    // Información general
    siteName: '',
    contactEmail: '',
    supportEmail: '',
    phone: '',
    address: '',
    
    // Configuraciones del sistema
    maintenanceMode: false,
    allowRegistration: true,
    defaultUserRole: 'cliente',
    
    // Redes sociales
    socialMedia: {
      facebook: '',
      whatsapp: '',
      instagram: '',
      twitter: ''
    },
    
    // Contenido editable
    content: {
      aboutUsTitle: '¿Quiénes Somos?',
      aboutUsText: '',
      heroTitle: 'Ferretería La Michoacana',
      heroSubtitle: 'Tu ferretería de confianza con más de 8 años de experiencia',
      missionText: '',
      visionText: '',
      valuesText: ''
    }
  })

  useEffect(() => {
    if (config) {
      setFormData({
        siteName: config.siteName || '',
        contactEmail: config.contactEmail || '',
        supportEmail: config.supportEmail || '',
        phone: config.phone || '',
        address: config.address || '',
        maintenanceMode: config.maintenanceMode || false,
        allowRegistration: config.allowRegistration !== false,
        defaultUserRole: config.defaultUserRole || 'cliente',
        socialMedia: {
          facebook: config.socialMedia?.facebook || '',
          whatsapp: config.socialMedia?.whatsapp || '',
          instagram: config.socialMedia?.instagram || '',
          twitter: config.socialMedia?.twitter || ''
        },
        content: {
          aboutUsTitle: config.content?.aboutUsTitle || '¿Quiénes Somos?',
          aboutUsText: config.content?.aboutUsText || '',
          heroTitle: config.content?.heroTitle || 'Ferretería La Michoacana',
          heroSubtitle: config.content?.heroSubtitle || 'Tu ferretería de confianza con más de 8 años de experiencia',
          missionText: config.content?.missionText || '',
          visionText: config.content?.visionText || '',
          valuesText: config.content?.valuesText || ''
        }
      })
    }
  }, [config])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (name.startsWith('socialMedia.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        socialMedia: {
          ...prev.socialMedia,
          [field]: value
        }
      }))
    } else if (name.startsWith('content.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [field]: value
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const db = getFirestore()
      await updateDoc(doc(db, 'systemConfig', 'general'), {
        ...formData,
        updatedAt: serverTimestamp()
      })
      
      alert('Configuración actualizada correctamente')
    } catch (error) {
      console.error('Error updating config:', error)
      alert('Error al actualizar la configuración')
    } finally {
      setIsSubmitting(false)
    }
  }

  const sections = [
    {
      id: 'general',
      name: 'General',
      icon: CogIcon,
      description: 'Información básica del sistema'
    },
    {
      id: 'contact',
      name: 'Contacto',
      icon: PhoneIcon,
      description: 'Información de contacto'
    },
    {
      id: 'social',
      name: 'Redes Sociales',
      icon: GlobeAltIcon,
      description: 'Enlaces a redes sociales'
    },
    {
      id: 'content',
      name: 'Contenido Web',
      icon: DocumentTextIcon,
      description: 'Textos editables del sitio'
    }
  ]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Sitio
              </label>
              <input
                type="text"
                name="siteName"
                value={formData.siteName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ferretería La Michoacana"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rol por Defecto
                </label>
                <select
                  name="defaultUserRole"
                  value={formData.defaultUserRole}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="cliente">Cliente</option>
                  <option value="vendedor">Vendedor</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={formData.maintenanceMode}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Modo Mantenimiento</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="allowRegistration"
                    checked={formData.allowRegistration}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Permitir Registro</span>
                </label>
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="contacto@ferreterialamichoacana.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de Soporte
                </label>
                <input
                  type="email"
                  name="supportEmail"
                  value={formData.supportEmail}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="soporte@ferreterialamichoacana.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono Principal
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección Principal
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Av. Madero #123, Centro Histórico, Morelia, Michoacán"
              />
            </div>
          </div>
        )

      case 'social':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  name="socialMedia.facebook"
                  value={formData.socialMedia.facebook}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://facebook.com/ferreterialamichoacana"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  name="socialMedia.whatsapp"
                  value={formData.socialMedia.whatsapp}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="+524431234567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  name="socialMedia.instagram"
                  value={formData.socialMedia.instagram}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://instagram.com/ferreterialamichoacana"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Twitter
                </label>
                <input
                  type="url"
                  name="socialMedia.twitter"
                  value={formData.socialMedia.twitter}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="https://twitter.com/ferrelamich"
                />
              </div>
            </div>
          </div>
        )

      case 'content':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Sección Hero</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    name="content.heroTitle"
                    value={formData.content.heroTitle}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Ferretería La Michoacana"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtítulo
                  </label>
                  <textarea
                    name="content.heroSubtitle"
                    value={formData.content.heroSubtitle}
                    onChange={handleInputChange}
                    rows={2}
                    className="input-field resize-none"
                    placeholder="Tu ferretería de confianza con más de 8 años de experiencia"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Sección "¿Quiénes Somos?"</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título de la Sección
                  </label>
                  <input
                    type="text"
                    name="content.aboutUsTitle"
                    value={formData.content.aboutUsTitle}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="¿Quiénes Somos?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Texto Descriptivo
                  </label>
                  <textarea
                    name="content.aboutUsText"
                    value={formData.content.aboutUsText}
                    onChange={handleInputChange}
                    rows={6}
                    className="input-field resize-none"
                    placeholder="Somos una empresa familiar mexicana dedicada a la venta de materiales de construcción..."
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Misión, Visión y Valores</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Misión
                  </label>
                  <textarea
                    name="content.missionText"
                    value={formData.content.missionText}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Proveer materiales de construcción y herramientas de la más alta calidad..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visión
                  </label>
                  <textarea
                    name="content.visionText"
                    value={formData.content.visionText}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Ser la ferretería líder en México, reconocida por nuestra excelencia..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valores
                  </label>
                  <textarea
                    name="content.valuesText"
                    value={formData.content.valuesText}
                    onChange={handleInputChange}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Honestidad, calidad, servicio al cliente, responsabilidad social..."
                  />
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Configuración del Sistema
        </h2>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navegación de secciones */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                    activeSection === section.id
                      ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-medium">{section.name}</div>
                    <div className="text-xs text-gray-500">{section.description}</div>
                  </div>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Contenido de la sección */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border p-6">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {sections.find(s => s.id === activeSection)?.name}
              </h3>
              <p className="text-sm text-gray-600">
                {sections.find(s => s.id === activeSection)?.description}
              </p>
            </div>

            {renderSectionContent()}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}