'use client'

import React, { useState } from 'react'
import { 
  DocumentTextIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PrinterIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface QuotationItem {
  id: string
  productName: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
}

interface Quotation {
  id: string
  quotationNumber: string
  requestId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany: string
  vendorName: string
  items: QuotationItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  validUntil: string
  notes: string
  terms: string
  status: 'borrador' | 'enviada' | 'aceptada' | 'rechazada' | 'vencida'
  createdAt: Date
  updatedAt: Date
  sentAt?: Date
  respondedAt?: Date
}

interface QuotationViewerProps {
  quotations: Quotation[]
  onEdit: (quotation: Quotation) => void
  onDelete: (quotationId: string) => void
  onSend: (quotationId: string) => void
  onDuplicate: (quotation: Quotation) => void
  loading?: boolean
}

// Funciones auxiliares
const getStatusColor = (status: string) => {
  switch (status) {
    case 'borrador':
      return 'bg-gray-100 text-gray-800'
    case 'enviada':
      return 'bg-blue-100 text-blue-800'
    case 'aceptada':
      return 'bg-green-100 text-green-800'
    case 'rechazada':
      return 'bg-red-100 text-red-800'
    case 'vencida':
      return 'bg-orange-100 text-orange-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'borrador':
      return 'Borrador'
    case 'enviada':
      return 'Enviada'
    case 'aceptada':
      return 'Aceptada'
    case 'rechazada':
      return 'Rechazada'
    case 'vencida':
      return 'Vencida'
    default:
      return status
  }
}

export default function QuotationViewer({
  quotations,
  onEdit,
  onDelete,
  onSend,
  onDuplicate,
  loading = false
}: QuotationViewerProps) {
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('todas')
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'borrador':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
      case 'enviada':
        return <PaperAirplaneIcon className="h-5 w-5 text-blue-500" />
      case 'aceptada':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'rechazada':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      case 'vencida':
        return <ClockIcon className="h-5 w-5 text-orange-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }



  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date()
  }

  const filteredQuotations = quotations.filter(quotation => {
    const matchesStatus = statusFilter === 'todas' || quotation.status === statusFilter
    const matchesSearch = 
      quotation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  const handlePrint = (quotation: Quotation) => {
    // En producción, esto generaría un PDF o abriría una ventana de impresión
    console.log('Printing quotation:', quotation.id)
    alert('Función de impresión en desarrollo')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg border p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg border p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field text-sm"
            >
              <option value="todas">Todos los estados</option>
              <option value="borrador">Borradores</option>
              <option value="enviada">Enviadas</option>
              <option value="aceptada">Aceptadas</option>
              <option value="rechazada">Rechazadas</option>
              <option value="vencida">Vencidas</option>
            </select>
          </div>
          
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por cliente, empresa o número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field text-sm w-full"
            />
          </div>
        </div>
      </div>

      {/* Lista de cotizaciones */}
      {filteredQuotations.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay cotizaciones
          </h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'todas'
              ? 'No se encontraron cotizaciones que coincidan con los filtros'
              : 'Aún no has creado ninguna cotización'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQuotations.map((quotation) => (
            <div key={quotation.id} className="bg-white rounded-lg border hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(quotation.status)}
                      <h3 className="text-lg font-semibold text-gray-900">
                        {quotation.quotationNumber}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                        {getStatusText(quotation.status)}
                      </span>
                      {isExpired(quotation.validUntil) && quotation.status === 'enviada' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          Vencida
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p><strong>Cliente:</strong> {quotation.clientName}</p>
                        <p><strong>Empresa:</strong> {quotation.clientCompany}</p>
                        <p><strong>Email:</strong> {quotation.clientEmail}</p>
                      </div>
                      <div>
                        <p><strong>Vendedor:</strong> {quotation.vendorName}</p>
                        <p><strong>Productos:</strong> {quotation.items.length}</p>
                        <p><strong>Total:</strong> <span className="font-semibold text-primary-600">${quotation.total.toLocaleString()}</span></p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Creada: {format(quotation.createdAt, 'dd MMM yyyy', { locale: es })}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      Válida hasta: {format(new Date(quotation.validUntil), 'dd MMM yyyy', { locale: es })}
                    </div>
                    {quotation.sentAt && (
                      <div className="flex items-center">
                        <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                        Enviada: {format(quotation.sentAt, 'dd MMM yyyy', { locale: es })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Productos resumidos */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Productos cotizados:</h4>
                  <div className="space-y-1">
                    {quotation.items.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity} {item.unit} - {item.productName}</span>
                        <span>${item.subtotal.toLocaleString()}</span>
                      </div>
                    ))}
                    {quotation.items.length > 3 && (
                      <p className="text-sm text-gray-500">
                        +{quotation.items.length - 3} productos más
                      </p>
                    )}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedQuotation(quotation)}
                    className="btn-secondary text-sm inline-flex items-center"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Ver Detalles
                  </button>
                  
                  {quotation.status === 'borrador' && (
                    <>
                      <button
                        onClick={() => onEdit(quotation)}
                        className="btn-secondary text-sm inline-flex items-center"
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Editar
                      </button>
                      <button
                        onClick={() => onSend(quotation.id)}
                        className="btn-primary text-sm inline-flex items-center"
                      >
                        <PaperAirplaneIcon className="h-4 w-4 mr-1" />
                        Enviar
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handlePrint(quotation)}
                    className="btn-secondary text-sm inline-flex items-center"
                  >
                    <PrinterIcon className="h-4 w-4 mr-1" />
                    Imprimir
                  </button>
                  
                  <button
                    onClick={() => onDuplicate(quotation)}
                    className="btn-secondary text-sm inline-flex items-center"
                  >
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    Duplicar
                  </button>
                  
                  {quotation.status === 'borrador' && (
                    <button
                      onClick={() => onDelete(quotation.id)}
                      className="text-red-600 hover:text-red-800 text-sm inline-flex items-center px-3 py-1 rounded"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedQuotation && (
        <QuotationDetailModal
          quotation={selectedQuotation}
          onClose={() => setSelectedQuotation(null)}
        />
      )}
    </div>
  )
}

// Componente modal para ver detalles completos
function QuotationDetailModal({ 
  quotation, 
  onClose 
}: { 
  quotation: Quotation
  onClose: () => void 
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-4xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {quotation.quotationNumber}
              </h2>
              <p className="text-sm text-gray-600">
                {quotation.clientName} • {quotation.clientCompany}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <XCircleIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Información general */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Empresa:</strong> {quotation.clientCompany}</p>
                  <p><strong>Contacto:</strong> {quotation.clientName}</p>
                  <p><strong>Email:</strong> {quotation.clientEmail}</p>
                  <p><strong>Teléfono:</strong> {quotation.clientPhone}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Detalles de la Cotización</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Vendedor:</strong> {quotation.vendorName}</p>
                  <p><strong>Creada:</strong> {format(quotation.createdAt, 'dd MMM yyyy HH:mm', { locale: es })}</p>
                  <p><strong>Válida hasta:</strong> {format(new Date(quotation.validUntil), 'dd MMM yyyy', { locale: es })}</p>
                  <p><strong>Estado:</strong> 
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quotation.status)}`}>
                      {getStatusText(quotation.status)}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Productos */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Productos Cotizados</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descuento</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {quotation.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                            {item.description && (
                              <p className="text-xs text-gray-500">{item.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.quantity} {item.unit}</td>
                        <td className="px-4 py-3 text-sm">${item.unitPrice.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm">{item.discount}%</td>
                        <td className="px-4 py-3 text-sm font-medium">${item.subtotal.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totales */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${quotation.subtotal.toLocaleString()}</span>
                </div>
                {quotation.discount > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Descuento ({quotation.discount}%):</span>
                    <span>-${((quotation.subtotal * quotation.discount) / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>IVA ({quotation.tax}%):</span>
                  <span>${(((quotation.subtotal - (quotation.subtotal * quotation.discount) / 100) * quotation.tax) / 100).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-300 pt-2">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary-600">${quotation.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas y términos */}
            {quotation.notes && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Notas Adicionales</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{quotation.notes}</p>
                </div>
              </div>
            )}

            {quotation.terms && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Términos y Condiciones</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{quotation.terms}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}