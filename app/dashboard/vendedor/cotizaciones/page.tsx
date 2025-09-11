'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MaintenancePage from '@/components/ui/MaintenancePage'
import QuotationViewer from '@/components/quotations/QuotationViewer'
import QuotationBuilder from '@/components/quotations/QuotationBuilder'
import { 
  CalculatorIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface Quotation {
  id: string
  quotationNumber: string
  requestId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany: string
  vendorName: string
  items: any[]
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

export default function QuotationsPage() {
  const { user, loading: authLoading } = useAuth()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewQuotation, setShowNewQuotation] = useState(false)
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null)

  // Cargar cotizaciones del vendedor
  useEffect(() => {
    const loadQuotations = async () => {
      if (!user?.uid) return

      try {
        // Simulación de datos - en producción usar Firebase
        const mockQuotations: Quotation[] = [
          {
            id: '1',
            quotationNumber: 'COT-2025-001',
            requestId: 'req-001',
            clientName: 'Juan Pérez',
            clientEmail: 'juan@constructoraabc.com',
            clientPhone: '(443) 123-4567',
            clientCompany: 'Constructora ABC',
            vendorName: user.displayName || 'Vendedor',
            items: [
              {
                id: '1',
                productName: 'Cemento Portland CPC 30 50kg',
                description: 'Cemento Portland Compuesto',
                unit: 'saco',
                quantity: 20,
                unitPrice: 185.00,
                discount: 5,
                subtotal: 3515.00
              }
            ],
            subtotal: 3515.00,
            discount: 0,
            tax: 16,
            total: 4077.40,
            validUntil: '2025-10-15',
            notes: 'Entrega en obra',
            terms: 'Precios válidos por 30 días',
            status: 'enviada',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            sentAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            quotationNumber: 'COT-2025-002',
            requestId: 'req-002',
            clientName: 'María González',
            clientEmail: 'maria@remodelacionesxyz.com',
            clientPhone: '(443) 987-6543',
            clientCompany: 'Remodelaciones XYZ',
            vendorName: user.displayName || 'Vendedor',
            items: [
              {
                id: '1',
                productName: 'Block hueco 15x20x40cm',
                description: 'Block hueco de concreto',
                unit: 'pieza',
                quantity: 100,
                unitPrice: 12.50,
                discount: 0,
                subtotal: 1250.00
              }
            ],
            subtotal: 1250.00,
            discount: 0,
            tax: 16,
            total: 1450.00,
            validUntil: '2025-10-20',
            notes: '',
            terms: 'Precios válidos por 30 días',
            status: 'borrador',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ]

        setQuotations(mockQuotations)
      } catch (error) {
        console.error('Error loading quotations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadQuotations()
  }, [user])

  // Verificar autenticación y rol
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== 'vendedor' && user.role !== 'gerente' && user.role !== 'admin')) {
    return (
      <MaintenancePage
        title="Acceso Restringido"
        message="Esta sección está disponible solo para vendedores y personal autorizado."
        showBackButton={true}
        contactInfo={false}
      />
    )
  }

  const handleSaveQuotation = async (quotationData: any) => {
    try {
      // En producción, esto se enviaría a Firebase
      console.log('Saving quotation:', quotationData)
      
      const newQuotation: Quotation = {
        ...quotationData,
        id: Date.now().toString(),
        quotationNumber: `COT-2025-${String(quotations.length + 1).padStart(3, '0')}`,
        vendorName: user.displayName || 'Vendedor'
      }

      setQuotations(prev => [newQuotation, ...prev])
      setShowNewQuotation(false)
      setEditingQuotation(null)
    } catch (error) {
      console.error('Error saving quotation:', error)
      throw error
    }
  }

  const handleEditQuotation = (quotation: Quotation) => {
    setEditingQuotation(quotation)
  }

  const handleDeleteQuotation = async (quotationId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta cotización?')) {
      try {
        // En producción, esto se enviaría a Firebase
        setQuotations(prev => prev.filter(q => q.id !== quotationId))
      } catch (error) {
        console.error('Error deleting quotation:', error)
        alert('Error al eliminar la cotización')
      }
    }
  }

  const handleSendQuotation = async (quotationId: string) => {
    try {
      // En producción, esto se enviaría a Firebase y se enviaría email
      setQuotations(prev => prev.map(q => 
        q.id === quotationId 
          ? { ...q, status: 'enviada' as const, sentAt: new Date() }
          : q
      ))
      alert('Cotización enviada exitosamente')
    } catch (error) {
      console.error('Error sending quotation:', error)
      alert('Error al enviar la cotización')
    }
  }

  const handleDuplicateQuotation = (quotation: Quotation) => {
    const duplicatedQuotation = {
      ...quotation,
      id: '', // Será asignado al guardar
      quotationNumber: '',
      status: 'borrador' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      sentAt: undefined,
      respondedAt: undefined
    }
    setEditingQuotation(duplicatedQuotation)
  }

  // Estadísticas
  const stats = {
    total: quotations.length,
    borradores: quotations.filter(q => q.status === 'borrador').length,
    enviadas: quotations.filter(q => q.status === 'enviada').length,
    aceptadas: quotations.filter(q => q.status === 'aceptada').length,
    totalValue: quotations.reduce((sum, q) => sum + q.total, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Cotizaciones
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona y da seguimiento a todas tus cotizaciones
              </p>
            </div>
            
            <button
              onClick={() => setShowNewQuotation(true)}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Nueva Cotización
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CalculatorIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">B</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Borradores</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.borradores}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">E</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Enviadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.enviadas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold text-sm">A</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aceptadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.aceptadas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="text-xl font-semibold text-gray-900">${stats.totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de cotizaciones */}
        <QuotationViewer
          quotations={quotations}
          onEdit={handleEditQuotation}
          onDelete={handleDeleteQuotation}
          onSend={handleSendQuotation}
          onDuplicate={handleDuplicateQuotation}
          loading={loading}
        />
      </div>

      {/* Modal de nueva cotización */}
      {showNewQuotation && (
        <QuotationBuilder
          requestId="general"
          clientInfo={{
            name: '',
            email: '',
            phone: '',
            company: ''
          }}
          isOpen={showNewQuotation}
          onClose={() => setShowNewQuotation(false)}
          onSave={handleSaveQuotation}
        />
      )}

      {/* Modal de edición */}
      {editingQuotation && (
        <QuotationBuilder
          requestId={editingQuotation.requestId}
          clientInfo={{
            name: editingQuotation.clientName,
            email: editingQuotation.clientEmail,
            phone: editingQuotation.clientPhone,
            company: editingQuotation.clientCompany
          }}
          isOpen={!!editingQuotation}
          onClose={() => setEditingQuotation(null)}
          onSave={handleSaveQuotation}
          initialData={editingQuotation}
        />
      )}
      
      <Footer />
    </div>
  )
}