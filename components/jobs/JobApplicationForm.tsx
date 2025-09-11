'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import FileManager from '@/components/files/FileManager'
import { 
  UserIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  PaperClipIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface JobApplicationData {
  // Información personal
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  
  // Información profesional
  currentPosition: string
  currentCompany: string
  yearsOfExperience: string
  expectedSalary: string
  availabilityDate: string
  
  // Educación
  education: string
  certifications: string
  
  // Habilidades y experiencia
  skills: string[]
  experience: string
  
  // Documentos
  resumeFile?: File
  coverLetter: string
  
  // Preferencias
  workSchedule: 'tiempo_completo' | 'medio_tiempo' | 'flexible'
  willingToRelocate: boolean
  hasTransportation: boolean
  
  // Referencias
  references: Array<{
    name: string
    position: string
    company: string
    phone: string
    email: string
  }>
  
  // Consentimientos
  dataConsent: boolean
  backgroundCheck: boolean
}

interface JobApplicationFormProps {
  jobId: string
  jobTitle: string
  branchName: string
  onSubmit: (data: JobApplicationData) => void
  onCancel: () => void
}

export default function JobApplicationForm({ 
  jobId, 
  jobTitle, 
  branchName, 
  onSubmit, 
  onCancel 
}: JobApplicationFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<JobApplicationData>({
    // Pre-llenar con datos del usuario si está logueado
    fullName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: 'Michoacán',
    currentPosition: '',
    currentCompany: '',
    yearsOfExperience: '',
    expectedSalary: '',
    availabilityDate: '',
    education: '',
    certifications: '',
    skills: [],
    experience: '',
    coverLetter: '',
    workSchedule: 'tiempo_completo',
    willingToRelocate: false,
    hasTransportation: true,
    references: [
      { name: '', position: '', company: '', phone: '', email: '' },
      { name: '', position: '', company: '', phone: '', email: '' }
    ],
    dataConsent: false,
    backgroundCheck: false
  })

  const [newSkill, setNewSkill] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleReferenceChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo y tamaño de archivo
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      const maxSize = 5 * 1024 * 1024 // 5MB
      
      if (!allowedTypes.includes(file.type)) {
        alert('Solo se permiten archivos PDF, DOC o DOCX')
        return
      }
      
      if (file.size > maxSize) {
        alert('El archivo no debe superar los 5MB')
        return
      }
      
      setFormData(prev => ({
        ...prev,
        resumeFile: file
      }))
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fullName && formData.email && formData.phone && formData.city)
      case 2:
        return !!(formData.yearsOfExperience && formData.availabilityDate)
      case 3:
        return !!(formData.education && formData.experience)
      case 4:
        return !!(formData.coverLetter)
      case 5:
        return formData.dataConsent && formData.backgroundCheck
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return
    
    setIsSubmitting(true)
    try {
      // Preparar datos para envío
      const applicationData = {
        ...formData,
        jobId,
        jobTitle,
        branchName
      }
      
      await onSubmit(applicationData)
    } catch (error) {
      console.error('Error submitting application:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: 'Información Personal', icon: UserIcon },
    { number: 2, title: 'Experiencia Profesional', icon: BriefcaseIcon },
    { number: 3, title: 'Educación y Habilidades', icon: AcademicCapIcon },
    { number: 4, title: 'Documentos', icon: DocumentTextIcon },
    { number: 5, title: 'Confirmación', icon: CheckCircleIcon }
  ]

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-primary-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Aplicar a Vacante</h2>
            <p className="text-gray-600">
              {jobTitle} - {branchName}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-center space-x-4 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-shrink-0">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number
                  ? 'bg-primary-500 border-primary-500 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircleIcon className="h-6 w-6" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-2 hidden sm:block">
                <p className={`text-xs font-medium ${
                  currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`hidden sm:block w-8 h-0.5 ml-2 ${
                  currentStep > step.number ? 'bg-primary-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {/* Paso 1: Información Personal */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="Ej. Juan Pérez García"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                  placeholder="(443) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección Completa
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Calle, número, colonia"
              />
            </div>
          </div>
        )}

        {/* Paso 2: Experiencia Profesional */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Experiencia Profesional</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puesto Actual
                </label>
                <input
                  type="text"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Ej. Vendedor"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empresa Actual
                </label>
                <input
                  type="text"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                  className="input-field"
                  placeholder="Ej. Ferretería ABC"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Años de Experiencia *
                </label>
                <select
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                >
                  <option value="">Seleccionar</option>
                  <option value="sin-experiencia">Sin experiencia</option>
                  <option value="menos-1">Menos de 1 año</option>
                  <option value="1-2">1-2 años</option>
                  <option value="3-5">3-5 años</option>
                  <option value="6-10">6-10 años</option>
                  <option value="mas-10">Más de 10 años</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salario Esperado
                </label>
                <select
                  name="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="">Seleccionar rango</option>
                  <option value="6000-8000">$6,000 - $8,000</option>
                  <option value="8000-10000">$8,000 - $10,000</option>
                  <option value="10000-12000">$10,000 - $12,000</option>
                  <option value="12000-15000">$12,000 - $15,000</option>
                  <option value="15000-mas">$15,000 o más</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Disponibilidad *
                </label>
                <input
                  type="date"
                  name="availabilityDate"
                  value={formData.availabilityDate}
                  onChange={handleInputChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario Preferido
                </label>
                <select
                  name="workSchedule"
                  value={formData.workSchedule}
                  onChange={handleInputChange}
                  className="input-field"
                >
                  <option value="tiempo_completo">Tiempo Completo</option>
                  <option value="medio_tiempo">Medio Tiempo</option>
                  <option value="flexible">Horario Flexible</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="willingToRelocate"
                  checked={formData.willingToRelocate}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Dispuesto/a a reubicación
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="hasTransportation"
                  checked={formData.hasTransportation}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Tengo transporte propio
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Paso 3: Educación y Habilidades */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Educación y Habilidades</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Educación *
              </label>
              <select
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="">Seleccionar nivel</option>
                <option value="primaria">Primaria</option>
                <option value="secundaria">Secundaria</option>
                <option value="bachillerato">Bachillerato</option>
                <option value="tecnico">Técnico</option>
                <option value="licenciatura">Licenciatura</option>
                <option value="posgrado">Posgrado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certificaciones o Cursos
              </label>
              <textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                rows={3}
                className="input-field resize-none"
                placeholder="Menciona certificaciones, cursos o capacitaciones relevantes..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Habilidades
              </label>
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Agregar habilidad"
                  className="flex-1 input-field"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn-secondary"
                >
                  Agregar
                </button>
              </div>
              
              {formData.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experiencia Laboral Detallada *
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                required
                rows={5}
                className="input-field resize-none"
                placeholder="Describe tu experiencia laboral, responsabilidades principales, logros destacados..."
              />
            </div>
          </div>
        )}

        {/* Paso 4: Documentos */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Documentos</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currículum Vitae y Documentos
              </label>
              <FileManager
                userId={user?.uid}
                relatedTo={`job-application-${Date.now()}`}
                relatedType="job_application"
                maxFiles={3}
                maxFileSize={5}
                acceptedTypes={['application/pdf', '.doc', '.docx', 'image/*']}
                compact={false}
                allowUpload={true}
                allowDelete={true}
                allowEdit={true}
                showUploader={true}
                description="Documentos para aplicación de empleo"
                tags={['cv', 'empleo', jobTitle]}
              />
              <p className="text-xs text-gray-500 mt-2">
                Sube tu CV, carta de presentación, certificados, etc. (máx. 3 archivos, 5MB cada uno)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carta de Presentación *
              </label>
              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleInputChange}
                required
                rows={6}
                className="input-field resize-none"
                placeholder="Escribe una carta de presentación explicando por qué eres el candidato ideal para este puesto..."
              />
            </div>

            {/* Referencias */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Referencias Laborales</h4>
              {formData.references.map((reference, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                  <h5 className="font-medium text-gray-700 mb-3">Referencia {index + 1}</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nombre completo"
                      value={reference.name}
                      onChange={(e) => handleReferenceChange(index, 'name', e.target.value)}
                      className="input-field text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Puesto"
                      value={reference.position}
                      onChange={(e) => handleReferenceChange(index, 'position', e.target.value)}
                      className="input-field text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Empresa"
                      value={reference.company}
                      onChange={(e) => handleReferenceChange(index, 'company', e.target.value)}
                      className="input-field text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Teléfono"
                      value={reference.phone}
                      onChange={(e) => handleReferenceChange(index, 'phone', e.target.value)}
                      className="input-field text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={reference.email}
                      onChange={(e) => handleReferenceChange(index, 'email', e.target.value)}
                      className="input-field text-sm md:col-span-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 5: Confirmación */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirmación y Consentimientos</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Resumen de tu Aplicación</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Puesto:</strong> {jobTitle}</p>
                <p><strong>Sucursal:</strong> {branchName}</p>
                <p><strong>Nombre:</strong> {formData.fullName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Experiencia:</strong> {formData.yearsOfExperience}</p>
                <p><strong>Disponibilidad:</strong> {formData.availabilityDate}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="dataConsent"
                  checked={formData.dataConsent}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <label className="ml-3 block text-sm text-gray-700">
                  <strong>Consentimiento de Datos:</strong> Autorizo el tratamiento de mis datos personales 
                  conforme a la Ley Federal de Protección de Datos Personales. Entiendo que mis datos 
                  serán utilizados únicamente para el proceso de reclutamiento y selección.
                </label>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="backgroundCheck"
                  checked={formData.backgroundCheck}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                />
                <label className="ml-3 block text-sm text-gray-700">
                  <strong>Verificación de Antecedentes:</strong> Autorizo la verificación de mis 
                  antecedentes laborales, académicos y referencias proporcionadas. Declaro que 
                  toda la información proporcionada es veraz y completa.
                </label>
              </div>
            </div>

            {(!formData.dataConsent || !formData.backgroundCheck) && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-yellow-800">
                      Debes aceptar ambos consentimientos para continuar con tu aplicación.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Anterior
        </button>

        <div className="flex space-x-3">
          {currentStep < 5 ? (
            <button
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
              className={`btn-primary ${!validateStep(currentStep) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(5) || isSubmitting}
              className={`btn-primary ${(!validateStep(5) || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Aplicación'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}