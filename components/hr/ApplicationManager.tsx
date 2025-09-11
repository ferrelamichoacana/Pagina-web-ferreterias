'use client'

import React, { useState } from 'react'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  phone: string
  status: 'nueva' | 'revisada' | 'entrevista' | 'rechazada' | 'contratada'
  appliedAt: Date
  branchName: string
  experience: string
  education: string
  skills: string[]
  coverLetter: string
  resumeUrl?: string
  notes: string[]
}

interface ApplicationManagerProps {
  application: JobApplication
  isOpen: boolean
  onClose: () => void
  onStatusChange: (applicationId: string, newStatus: JobApplication['status'], notes?: string) => void
}

export default function ApplicationManager({ 
  application, 
  isOpen, 
  onClose, 
  onStatusChange 
}: ApplicationManagerProps) {
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)

  if (!isOpen) return null

  const handleStatusChange = (newStatus: JobApplication['status']) => {
    const note = newNote.trim()
    if (note) {
      onStatusChange(application.id, newStatus, note)
      setNewNote('')
    } else {
      onStatusChange(application.id, newStatus)
    }
  }

  const addNote = () => {
    if (newNote.trim()) {
      // En producción, esto se enviaría a Firebase
      console.log('Adding note:', newNote)
      setNewNote('')
      setIsAddingNote(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nueva':
        return 'bg-blue-100 text-blue-800'
      case 'revisada':
        return 'bg-yellow-100 text-yellow-800'
      case 'entrevista':
        return 'bg-orange-100 text-orange-800'
      case 'contratada':
        return 'bg-green-100 text-green-800'
      case 'rechazada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {application.applicantName}
              </h2>
              <p className="text-sm text-gray-600">
                Aplicación para: {application.jobTitle}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {application.status}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <XCircleIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Información personal */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{application.applicantEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{application.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Fecha de Aplicación</p>
                  <p className="font-medium">
                    {format(application.appliedAt, 'dd MMM yyyy HH:mm', { locale: es })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <BriefcaseIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Sucursal</p>
                  <p className="font-medium">{application.branchName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Experiencia y educación */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Experiencia Laboral</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {application.experience}
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Educación</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {application.education || 'No especificada'}
              </p>
            </div>
          </div>

          {/* Habilidades */}
          {application.skills && application.skills.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Habilidades</h4>
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Carta de presentación */}
          {application.coverLetter && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Carta de Presentación</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {application.coverLetter}
                </p>
              </div>
            </div>
          )}

          {/* CV/Resume */}
          {application.resumeUrl && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Currículum Vitae</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Ver CV (PDF)
                </a>
              </div>
            </div>
          )}

          {/* Notas internas */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Notas Internas</h4>
            
            {application.notes && application.notes.length > 0 ? (
              <div className="space-y-2 mb-4">
                {application.notes.map((note, index) => (
                  <div key={index} className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                    <p className="text-sm text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">No hay notas aún</p>
            )}
            
            {isAddingNote ? (
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Agregar nota interna..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addNote}
                    className="btn-primary text-sm"
                  >
                    Guardar Nota
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingNote(false)
                      setNewNote('')
                    }}
                    className="btn-secondary text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingNote(true)}
                className="btn-secondary text-sm inline-flex items-center"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                Agregar Nota
              </button>
            )}
          </div>
        </div>

        {/* Acciones */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-4">
            {/* Campo para nota adicional */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nota adicional (opcional)
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Agregar comentario sobre el cambio de estado..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
              />
            </div>
            
            {/* Botones de acción */}
            <div className="flex flex-wrap gap-2">
              {application.status === 'nueva' && (
                <>
                  <button
                    onClick={() => handleStatusChange('revisada')}
                    className="btn-primary text-sm inline-flex items-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Marcar como Revisada
                  </button>
                  <button
                    onClick={() => handleStatusChange('entrevista')}
                    className="btn-secondary text-sm inline-flex items-center"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Programar Entrevista
                  </button>
                </>
              )}
              
              {application.status === 'revisada' && (
                <>
                  <button
                    onClick={() => handleStatusChange('entrevista')}
                    className="btn-primary text-sm inline-flex items-center"
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Programar Entrevista
                  </button>
                  <button
                    onClick={() => handleStatusChange('rechazada')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Rechazar
                  </button>
                </>
              )}
              
              {application.status === 'entrevista' && (
                <>
                  <button
                    onClick={() => handleStatusChange('contratada')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Contratar
                  </button>
                  <button
                    onClick={() => handleStatusChange('rechazada')}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Rechazar
                  </button>
                </>
              )}
              
              {(application.status === 'contratada' || application.status === 'rechazada') && (
                <div className="text-sm text-gray-600 flex items-center">
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Proceso completado
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}