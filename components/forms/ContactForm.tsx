'use client'

import React, { useState } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { branches } from '@/lib/data/branches'
import SimpleCaptcha from '@/components/ui/SimpleCaptcha'
import FileManager from '@/components/files/FileManager'
import { PaperClipIcon } from '@heroicons/react/24/outline'


interface ContactFormData {
  companyName: string
  contactName: string
  email: string
  phone: string
  branchId: string
  location: string
  estimatedBudget: string
  projectDescription: string
  subscribeNewsletter: boolean
}

export default function ContactForm() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<ContactFormData>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    branchId: '',
    location: '',
    estimatedBudget: '',
    projectDescription: '',
    subscribeNewsletter: false
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isCaptchaValid, setIsCaptchaValid] = useState(false)
  const [showFileManager, setShowFileManager] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]) // IDs de archivos

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
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
      // Crear solicitud en Firestore
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        
        // Limpiar formulario después del éxito
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          branchId: '',
          location: '',
          estimatedBudget: '',
          projectDescription: '',
          subscribeNewsletter: false
        })
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
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t.contact.title}
        </h2>
        <p className="text-gray-600">
          {t.contact.subtitle}
        </p>
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-center font-medium">
            {t.contact.success}
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 text-center font-medium">
            {t.contact.error}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre de la empresa */}
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contact.companyName} *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleInputChange}
            required
            className="input-field"
            placeholder="Ej. Constructora ABC"
          />
        </div>

        {/* Nombre de contacto */}
        <div>
          <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contact.contactName} *
          </label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            required
            className="input-field"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        {/* Email y teléfono en fila */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t.contact.email} *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="input-field"
              placeholder="correo@empresa.com"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              {t.contact.phone} *
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
        </div>

        {/* Sucursal más cercana */}
        <div>
          <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contact.branch}
          </label>
          <select
            id="branchId"
            name="branchId"
            value={formData.branchId}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">{t.contact.selectBranch}</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>
                {branch.name} - {branch.city}, {branch.state}
              </option>
            ))}
          </select>
        </div>

        {/* Ubicación */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contact.location} *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="input-field"
            placeholder="Ej. Morelia, Michoacán"
          />
        </div>

        {/* Presupuesto estimado */}
        <div>
          <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contact.budget}
          </label>
          <select
            id="estimatedBudget"
            name="estimatedBudget"
            value={formData.estimatedBudget}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="">Seleccionar rango</option>
            <option value="menos-50k">Menos de $50,000</option>
            <option value="50k-100k">$50,000 - $100,000</option>
            <option value="100k-500k">$100,000 - $500,000</option>
            <option value="500k-1m">$500,000 - $1,000,000</option>
            <option value="mas-1m">Más de $1,000,000</option>
          </select>
        </div>

        {/* Descripción del proyecto */}
        <div>
          <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
            {t.contact.description} *
          </label>
          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleInputChange}
            required
            rows={4}
            className="input-field resize-none"
            placeholder="Describe tu proyecto, materiales necesarios, cantidades aproximadas, etc."
          />
        </div>

        {/* Archivos adjuntos */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Archivos adjuntos (opcional)
            </label>
            <button
              type="button"
              onClick={() => setShowFileManager(!showFileManager)}
              className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
            >
              <PaperClipIcon className="w-4 h-4" />
              <span>{showFileManager ? 'Ocultar' : 'Adjuntar archivos'}</span>
            </button>
          </div>
          
          {showFileManager && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <FileManager
                userId="contact-form"
                relatedTo={`contact-${Date.now()}`}
                relatedType="contact"
                maxFiles={5}
                maxFileSize={10}
                acceptedTypes={['image/*', 'application/pdf', '.doc', '.docx']}
                compact={true}
                allowUpload={true}
                allowDelete={true}
                allowEdit={false}
                description="Archivos relacionados con la solicitud de cotización"
                tags={['cotización', 'proyecto']}
              />
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1">
            Puedes adjuntar planos, especificaciones, fotos del proyecto, etc. (máx. 5 archivos, 10MB cada uno)
          </p>
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
            {t.contact.newsletter}
          </label>
        </div>

        {/* Captcha Anti-Spam */}
        <SimpleCaptcha 
          onVerify={setIsCaptchaValid}
          className="border-t pt-6"
        />

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !isCaptchaValid}
            className={`w-full btn-primary py-3 text-lg font-medium ${
              isSubmitting || !isCaptchaValid ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? t.form.loading : t.contact.submit}
          </button>
          
          {!isCaptchaValid && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Por favor completa la verificación anti-spam
            </p>
          )}
        </div>
      </form>

      {/* Nota sobre privacidad */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500">
          Al enviar este formulario, aceptas que procesemos tus datos para contactarte. 
          Consulta nuestra política de privacidad para más información.
        </p>
      </div>
    </div>
  )
}

/*
 * NOTAS PARA IMPLEMENTACIÓN FUTURA:
 * 
 * 1. Integración con Firebase:
 *    - Conectar handleSubmit con createContactRequest de firestore.ts
 *    - Implementar validación de datos en el backend
 *    - Agregar manejo de errores específicos
 * 
 * 2. Envío de emails:
 *    - Integrar con sendContactConfirmation de email.ts
 *    - Enviar notificación al gerente de la sucursal seleccionada
 * 
 * 3. Validaciones adicionales:
 *    - Validación de formato de teléfono mexicano
 *    - Validación de email en tiempo real
 *    - Captcha para prevenir spam
 * 
 * 4. Mejoras UX:
 *    - Autocompletado de ubicación con Google Places API
 *    - Selección automática de sucursal más cercana
 *    - Guardado de borrador en localStorage
 */