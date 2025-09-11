'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import SimpleCaptcha from '@/components/ui/SimpleCaptcha'
import { PaperClipIcon } from '@heroicons/react/24/outline'

interface HRContactFormData {
  fullName: string
  email: string
  phone: string
  subject: string
  message: string
  subscribeNewsletter: boolean
}

export default function HRContactForm() {
  const { t } = useLanguage()
  
  const [formData, setFormData] = useState<HRContactFormData>({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    subscribeNewsletter: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    // Limpiar estado de envío cuando el usuario empiece a escribir
    if (submitStatus !== 'idle') setSubmitStatus('idle')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Verificar captcha antes de enviar
    if (!isCaptchaValid) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Preparar datos para envío
      const submitData = {
        ...formData,
        type: 'hr_contact',
        companyName: 'Consulta RRHH',
        branchId: 'general',
        location: 'General',
        estimatedBudget: 'N/A',
        projectDescription: formData.message
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        // Limpiar formulario
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          subscribeNewsletter: false
        })
        setIsCaptchaValid(false)
      } else {
        setSubmitStatus('error')
        console.error('Error from API:', result.error)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensaje de éxito */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-center font-medium">
            ¡Mensaje enviado exitosamente! Nos pondremos en contacto contigo pronto.
          </p>
        </div>
      )}

      {/* Mensaje de error */}
      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-center font-medium">
            Error al enviar el mensaje. Por favor intenta de nuevo.
          </p>
        </div>
      )}

      {/* Nombre completo */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
          Nombre Completo *
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          required
          className="input-field"
          placeholder="Tu nombre completo"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo Electrónico *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="input-field"
          placeholder="tu@email.com"
        />
      </div>

      {/* Teléfono */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="input-field"
          placeholder="(443) 123-4567"
        />
      </div>

      {/* Asunto */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Asunto *
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          required
          className="input-field"
        >
          <option value="">Selecciona un asunto</option>
          <option value="consulta_vacante">Consulta sobre vacante específica</option>
          <option value="estado_aplicacion">Estado de mi aplicación</option>
          <option value="proceso_seleccion">Información sobre proceso de selección</option>
          <option value="beneficios">Consulta sobre beneficios</option>
          <option value="oportunidades">Oportunidades de crecimiento</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Mensaje *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={5}
          className="input-field resize-none"
          placeholder="Describe tu consulta o pregunta..."
        />
      </div>

      {/* Newsletter */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="subscribeNewsletter"
          name="subscribeNewsletter"
          checked={formData.subscribeNewsletter}
          onChange={handleInputChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="subscribeNewsletter" className="ml-2 block text-sm text-gray-700">
          Suscribirme al newsletter para recibir ofertas de empleo
        </label>
      </div>

      {/* Captcha */}
      <div>
        <SimpleCaptcha onVerify={setIsCaptchaValid} />
      </div>

      {/* Botón de envío */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting || !isCaptchaValid}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>
      </div>
    </form>
  )
}