'use client'

import React, { useState } from 'react'
import { uploadWithPreset } from '@/lib/utils/cloudinary'

export default function JobApplicationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    desiredPosition: '',
    experience: '',
    message: ''
  })

  const [files, setFiles] = useState<{
    photo: File | null
    cv: File | null
  }>({
    photo: null,
    cv: null
  })

  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'cv') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError(`El archivo ${type === 'photo' ? 'de foto' : 'de CV'} es muy grande. Máximo 5MB.`)
        return
      }

      // Validar tipo de archivo
      if (type === 'photo') {
        if (!file.type.startsWith('image/')) {
          setError('Por favor selecciona una imagen válida para la foto.')
          return
        }
      } else {
        const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
        if (!validTypes.includes(file.type)) {
          setError('El CV debe ser un archivo PDF o Word (.doc, .docx)')
          return
        }
      }

      setFiles(prev => ({ ...prev, [type]: file }))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      // Validar que todos los campos estén llenos
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.desiredPosition) {
        throw new Error('Por favor completa todos los campos obligatorios')
      }

      if (!files.cv) {
        throw new Error('Por favor adjunta tu CV')
      }

      setUploading(true)

      // Subir archivos a Cloudinary
      let photoUrl = ''
      let cvUrl = ''

      if (files.photo) {
        const photoResult = await uploadWithPreset(files.photo, 'job_applications')
        photoUrl = photoResult.url
      }

      const cvResult = await uploadWithPreset(files.cv, 'job_applications')
      cvUrl = cvResult.url

      setUploading(false)

      // Enviar datos al API
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          photoUrl,
          cvUrl
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al enviar la solicitud')
      }

      setSuccess(true)
      
      // Limpiar formulario
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        desiredPosition: '',
        experience: '',
        message: ''
      })
      setFiles({ photo: null, cv: null })

      // Limpiar inputs de archivo
      const photoInput = document.getElementById('photo') as HTMLInputElement
      const cvInput = document.getElementById('cv') as HTMLInputElement
      if (photoInput) photoInput.value = ''
      if (cvInput) cvInput.value = ''

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la solicitud')
    } finally {
      setSubmitting(false)
    }
  }

  const positions = [
    'Vendedor(a)',
    'Cajero(a)',
    'Almacenista',
    'Gerente de Tienda',
    'Auxiliar Administrativo',
    'Chofer Repartidor',
    'Contador(a)',
    'Recursos Humanos',
    'Otro'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Únete a Nuestro Equipo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos buscando talento comprometido y apasionado. Envíanos tu información y CV para ser considerado en futuras oportunidades.
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {success ? (
            <div className="text-center py-12">
              <div className="mb-6">
                <svg className="w-20 h-20 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Solicitud Enviada!
              </h3>
              <p className="text-gray-600 mb-8">
                Gracias por tu interés. Hemos recibido tu información y la revisaremos a la brevedad. Te contactaremos si tu perfil coincide con nuestras necesidades.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Enviar otra solicitud
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Información Personal */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Información Personal
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre(s) *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Juan"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Pérez García"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="tu@email.com"
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="443 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Puesto Deseado */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Información Laboral
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puesto Deseado *
                    </label>
                    <select
                      name="desiredPosition"
                      value={formData.desiredPosition}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecciona un puesto</option>
                      {positions.map(position => (
                        <option key={position} value={position}>
                          {position}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Años de Experiencia
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Ej: 2 años en ventas"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensaje Adicional
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Cuéntanos por qué te gustaría trabajar con nosotros..."
                    />
                  </div>
                </div>
              </div>

              {/* Archivos */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Documentos
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fotografía (Opcional)
                    </label>
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'photo')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: JPG, PNG. Máximo 5MB
                    </p>
                    {files.photo && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {files.photo.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curriculum Vitae (CV) *
                    </label>
                    <input
                      type="file"
                      id="cv"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'cv')}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos: PDF, DOC, DOCX. Máximo 5MB
                    </p>
                    {files.cv && (
                      <p className="text-sm text-green-600 mt-1">
                        ✓ {files.cv.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de envío */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full bg-primary-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Subiendo archivos...
                    </>
                  ) : submitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Solicitud'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Info adicional */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Al enviar tu solicitud, aceptas que tus datos sean utilizados para procesos de reclutamiento.
          </p>
        </div>
      </div>
    </div>
  )
}
