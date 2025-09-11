'use client'

import React, { useState } from 'react'
import { 
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

import QuotationBuilder from '@/components/quotations/QuotationBuilder'

interface ContactRequest {
  id: string
  trackingId: string
  companyName: string
  contactName: string
  email: string
  phone: string
  location: string
  projectDescription: string
  estimatedBudget: string
  status: 'pendiente' | 'asignada' | 'en_proceso' | 'resuelta' | 'cerrada'
  priority: 'baja' | 'media' | 'alta' | 'urgente'
  assignedAt: Date
  createdAt: Date
  lastContact?: Date
  notes: string[]
  branchId: string
  branchName: string
  vendorNotes?: string[]
  quotations?: Array<{
    id: string
    items: Array<{ product: string; quantity: number; price: number }>
    total: number
    createdAt: Date
    status: 'borrador' | 'enviada' | 'aceptada' | 'rechazada'
  }>
}

interface RequestManagerProps {
  request: ContactRequest
  isOpen: boolean
  onClose: () => void
  onStatusChange: (requestId: string, newStatus: ContactRequest['status'], notes?: string) => void
}

export default function RequestManager({ 
  request, 
  isOpen, 
  onClose, 
  onStatusChange 
}: RequestManagerProps) {
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [showQuotationBuilder, setShowQuotationBuilder] = useState(false)

  if (!isOpen) return null

  const handleStatusChange = (newStatus: ContactRequest['status']) => {
    const note = newNote.trim()
    if (note) {
      onStatusChange(request.id, newStatus, note)
      setNewNote('')
    } else {
      onStatusChange(request.id, newStatus)
    }
  }

  const addNote = () => {
    if (newNote.trim()) {
      // En producción, esto se enviaría a Firebase
      console.log('Adding vendor note:', newNote)
      setNewNote('')
      setIsAddingNote(false)
    }
  }

  const handleQuotationSave = async (quotationData: any) => {
    try {
      // En producción, esto se enviaría a Firebase
      console.log('Saving quotation:', quotationData)
      
      // Actualizar las cotizaciones del request
      // En producción, esto se haría a través de una API
      alert('Cotización guardada exitosamente')
      
      setShowQuotationBuilder(false)
    } catch (error) {
      console.error('Error saving quotation:', error)
      alert('Error al guardar la cotización')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'asignada':
        return 'bg-blue-100 text-blue-800'
      case 'en_proceso':
        return 'bg-orange-100 text-orange-800'
      case 'resuelta':
        return 'bg-green-100 text-green-800'
      case 'cerrada':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente':
        return 'bg-red-100 text-red-800'
      case 'alta':
        return 'bg-orange-100 text-orange-800'
      case 'media':
        return 'bg-yellow-100 text-yellow-800'
      case 'baja':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getBudgetLabel = (budget: string) => {
    switch (budget) {
      case 'menos-50k':
        return 'Menos de $50,000'
      case '50k-100k':
        return '$50,000 - $100,000'
      case '100k-500k':
        return '$100,000 - $500,000'
      case '500k-1m':
        return '$500,000 - $1,000,000'
      case 'mas-1m':
        return 'Más de $1,000,000'
      default:
        return 'No especificado'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {request.companyName}
              </h2>
              <p className="text-sm text-gray-600">
                Solicitud: {request.trackingId} • Contacto: {request.contactName}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                {request.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(request.priority)}`}>
                {request.priority}
              </span>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Información del cliente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
              Información del Cliente
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a href={`mailto:${request.email}`} className="font-medium text-primary-600 hover:text-primary-700">
                    {request.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <a href={`tel:${request.phone}`} className="font-medium text-primary-600 hover:text-primary-700">
                    {request.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Ubicación</p>
                  <p className="font-medium">{request.location}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Presupuesto Estimado</p>
                  <p className="font-medium">{getBudgetLabel(request.estimatedBudget)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción del proyecto */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Descripción del Proyecto</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {request.projectDescription}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-4 w-4 text-gray-400" />
                <span>Solicitud creada: {format(request.createdAt, 'dd MMM yyyy HH:mm', { locale: es })}</span>
              </div>
              <div className="flex items-center space-x-3">
                <ExclamationTriangleIcon className="h-4 w-4 text-blue-400" />
                <span>Asignada a ti: {format(request.assignedAt, 'dd MMM yyyy HH:mm', { locale: es })}</span>
              </div>
              {request.lastContact && (
                <div className="flex items-center space-x-3">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-green-400" />
                  <span>Último contacto: {format(request.lastContact, 'dd MMM yyyy HH:mm', { locale: es })}</span>
                </div>
              )}
            </div>
          </div>

          {/* Notas del vendedor */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Mis Notas</h4>
            
            {request.vendorNotes && request.vendorNotes.length > 0 ? (
              <div className="space-y-2 mb-4">
                {request.vendorNotes.map((note, index) => (
                  <div key={index} className="bg-blue-50 border-l-4 border-blue-400 p-3">
                    <p className="text-sm text-gray-700">{note}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mb-4">No has agregado notas aún</p>
            )}
            
            {isAddingNote ? (
              <div className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Agregar nota sobre el cliente o proyecto..."
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
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Agregar Nota
              </button>
            )}
          </div>

          {/* Cotizaciones */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-gray-900">Cotizaciones</h4>
              <button
                onClick={() => setShowQuotationBuilder(true)}
                className="btn-primary text-sm inline-flex items-center"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Nueva Cotización
              </button>
            </div>
            
            {request.quotations && request.quotations.length > 0 ? (
              <div className="space-y-3">
                {request.quotations.map((quotation) => (
                  <div key={quotation.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Cotización #{quotation.id}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        quotation.status === 'aceptada' ? 'bg-green-100 text-green-800' :
                        quotation.status === 'rechazada' ? 'bg-red-100 text-red-800' :
                        quotation.status === 'enviada' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {quotation.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Total: ${quotation.total.toLocaleString()} • {format(quotation.createdAt, 'dd MMM yyyy', { locale: es })}
                    </p>
                    <div className="text-sm">
                      {quotation.items.slice(0, 2).map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.product}</span>
                          <span>{item.quantity} x ${item.price.toLocaleString()}</span>
                        </div>
                      ))}
                      {quotation.items.length > 2 && (
                        <p className="text-gray-500">+{quotation.items.length - 2} productos más</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay cotizaciones aún</p>
            )}


          </div>
        </div>

        {/* Acciones */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="space-y-4">
            {/* Contacto directo */}
            <div className="flex space-x-3">

              <a
                href={`tel:${request.phone}`}
                className="flex-1 btn-secondary inline-flex items-center justify-center"
              >
                <PhoneIcon className="h-4 w-4 mr-2" />
                Llamar
              </a>
              <a
                href={`mailto:${request.email}`}
                className="flex-1 btn-secondary inline-flex items-center justify-center"
              >
                <EnvelopeIcon className="h-4 w-4 mr-2" />
                Email
              </a>
            </div>
            
            {/* Campo para nota de cambio de estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nota sobre el progreso (opcional)
              </label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Describe el progreso o próximos pasos..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm"
              />
            </div>
            
            {/* Botones de cambio de estado */}
            <div className="flex flex-wrap gap-2">
              {request.status === 'asignada' && (
                <button
                  onClick={() => handleStatusChange('en_proceso')}
                  className="btn-primary text-sm inline-flex items-center"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                  Iniciar Proceso
                </button>
              )}
              
              {request.status === 'en_proceso' && (
                <>
                  <button
                    onClick={() => handleStatusChange('resuelta')}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm inline-flex items-center"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Marcar como Resuelta
                  </button>
                  <button
                    onClick={() => handleStatusChange('asignada')}
                    className="btn-secondary text-sm inline-flex items-center"
                  >
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Volver a Asignada
                  </button>
                </>
              )}
              
              {request.status === 'resuelta' && (
                <div className="text-sm text-green-600 flex items-center">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Solicitud completada exitosamente
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QuotationBuilder Modal */}
      {showQuotationBuilder && (
        <QuotationBuilder
          requestId={request.id}
          clientInfo={{
            name: request.contactName,
            email: request.email,
            phone: request.phone,
            company: request.companyName
          }}
          isOpen={showQuotationBuilder}
          onClose={() => setShowQuotationBuilder(false)}
          onSave={handleQuotationSave}
        />
      )}
    </div>
  )
}