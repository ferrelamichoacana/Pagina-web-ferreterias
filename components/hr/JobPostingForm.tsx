'use client'

import React, { useState } from 'react'
import { branches } from '@/lib/data/branches'
import { 
  BriefcaseIcon,
  XMarkIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'

interface JobPostingFormData {
  title: string
  department: string
  branchId: string
  description: string
  requirements: string
  responsibilities: string
  salaryMin: string
  salaryMax: string
  type: 'tiempo_completo' | 'medio_tiempo' | 'temporal'
  experience: string
  education: string
  skills: string[]
  benefits: string
  status: 'activa' | 'pausada'
}

interface JobPostingFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: JobPostingFormData) => void
  initialData?: Partial<JobPostingFormData>
  isEditing?: boolean
}

export default function JobPostingForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData,
  isEditing = false 
}: JobPostingFormProps) {
  const [formData, setFormData] = useState<JobPostingFormData>({
    title: initialData?.title || '',
    department: initialData?.department || '',
    branchId: initialData?.branchId || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    responsibilities: initialData?.responsibilities || '',
    salaryMin: initialData?.salaryMin || '',
    salaryMax: initialData?.salaryMax || '',
    type: initialData?.type || 'tiempo_completo',
    experience: initialData?.experience || '',
    education: initialData?.education || '',
    skills: initialData?.skills || [],
    benefits: initialData?.benefits || '',
    status: initialData?.status || 'activa'
  })

  const [newSkill, setNewSkill] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting job posting:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const departments = [
    'Ventas',
    'Logística',
    'Administración',
    'Recursos Humanos',
    'IT/Sistemas',
    'Mantenimiento',
    'Seguridad'
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-3xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-primary-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BriefcaseIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Editar Vacante' : 'Nueva Vacante'}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título del Puesto *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="input-field"
                placeholder="Ej. Vendedor de Mostrador"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Departamento *
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="">Seleccionar departamento</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-2">
                Sucursal *
              </label>
              <select
                id="branchId"
                name="branchId"
                value={formData.branchId}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="">Seleccionar sucursal</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.city}, {branch.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Empleo *
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="input-field"
              >
                <option value="tiempo_completo">Tiempo Completo</option>
                <option value="medio_tiempo">Medio Tiempo</option>
                <option value="temporal">Temporal</option>
              </select>
            </div>
          </div>

          {/* Salario */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <CurrencyDollarIcon className="h-4 w-4 inline mr-1" />
              Rango Salarial
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  name="salaryMin"
                  value={formData.salaryMin}
                  onChange={handleInputChange}
                  placeholder="Salario mínimo"
                  className="input-field"
                />
              </div>
              <div>
                <input
                  type="number"
                  name="salaryMax"
                  value={formData.salaryMax}
                  onChange={handleInputChange}
                  placeholder="Salario máximo"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Puesto *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="input-field resize-none"
              placeholder="Describe el puesto, el ambiente de trabajo y lo que hace especial esta oportunidad..."
            />
          </div>

          {/* Responsabilidades */}
          <div>
            <label htmlFor="responsibilities" className="block text-sm font-medium text-gray-700 mb-2">
              Responsabilidades Principales *
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleInputChange}
              required
              rows={4}
              className="input-field resize-none"
              placeholder="Lista las principales responsabilidades del puesto..."
            />
          </div>

          {/* Requisitos */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
              Requisitos *
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              required
              rows={4}
              className="input-field resize-none"
              placeholder="Especifica los requisitos mínimos para el puesto..."
            />
          </div>

          {/* Experiencia y Educación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Experiencia Requerida
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej. 2 años en ventas"
              />
            </div>

            <div>
              <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-2">
                Educación Requerida
              </label>
              <input
                type="text"
                id="education"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Ej. Bachillerato terminado"
              />
            </div>
          </div>

          {/* Habilidades */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habilidades Deseadas
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

          {/* Beneficios */}
          <div>
            <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
              Beneficios
            </label>
            <textarea
              id="benefits"
              name="benefits"
              value={formData.benefits}
              onChange={handleInputChange}
              rows={3}
              className="input-field resize-none"
              placeholder="Describe los beneficios que ofrece la empresa..."
            />
          </div>

          {/* Estado */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Estado de la Vacante
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="activa">Activa</option>
              <option value="pausada">Pausada</option>
            </select>
          </div>
        </form>

        {/* Botones de acción */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting 
                ? 'Guardando...' 
                : isEditing 
                ? 'Actualizar Vacante' 
                : 'Publicar Vacante'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}