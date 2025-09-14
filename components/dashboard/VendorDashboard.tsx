'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MaintenancePage from '@/components/ui/MaintenancePage'
import BackButton from '@/components/ui/BackButton'

import Link from 'next/link'
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { PlusIcon } from '@heroicons/react/24/solid'

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
}

export default function VendorDashboard() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const [assignedRequests, setAssignedRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('todas')
  const [selectedPriority, setSelectedPriority] = useState<string>('todas')

  // Cargar solicitudes asignadas al vendedor (simulado - en producción usar Firebase)
  useEffect(() => {
    const loadAssignedRequests = async () => {
      if (!user?.uid) return

      // Simulación de solicitudes asignadas
      const mockRequests: ContactRequest[] = [
        {
          id: '1',
          trackingId: 'REQ-2025-001',
          companyName: 'Constructora ABC',
          contactName: 'Juan Pérez',
          email: 'juan.perez@constructoraabc.com',
          phone: '(443) 123-4567',
          location: 'Morelia, Michoacán',
          projectDescription: 'Construcción de casa habitación de 120m2. Necesito cemento, blocks, varilla y materiales básicos.',
          estimatedBudget: '100k-500k',
          status: 'asignada',
          priority: 'alta',
          assignedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          notes: [],
          branchId: 'morelia-centro',
          branchName: 'Morelia Centro'
        },
        {
          id: '2',
          trackingId: 'REQ-2025-002',
          companyName: 'Remodelaciones XYZ',
          contactName: 'María González',
          email: 'maria@remodelacionesxyz.com',
          phone: '(443) 987-6543',
          location: 'Morelia, Michoacán',
          projectDescription: 'Remodelación de baño completo. Necesito azulejos, sanitarios, tubería y accesorios.',
          estimatedBudget: '50k-100k',
          status: 'en_proceso',
          priority: 'media',
          assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
          lastContact: new Date(Date.now() - 4 * 60 * 60 * 1000),
          notes: ['Cliente interesado en promociones', 'Solicita cotización detallada'],
          branchId: 'morelia-centro',
          branchName: 'Morelia Centro'
        },
        {
          id: '3',
          trackingId: 'REQ-2025-003',
          companyName: 'Obras Civiles DEF',
          contactName: 'Carlos Ramírez',
          email: 'carlos@obrasdef.com',
          phone: '(443) 555-0123',
          location: 'Pátzcuaro, Michoacán',
          projectDescription: 'Construcción de bodega industrial. Requiero estructura metálica, láminas y herrajes.',
          estimatedBudget: 'mas-1m',
          status: 'resuelta',
          priority: 'urgente',
          assignedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
          lastContact: new Date(Date.now() - 24 * 60 * 60 * 1000),
          notes: ['Venta cerrada por $850,000', 'Cliente satisfecho', 'Posible cliente recurrente'],
          branchId: 'morelia-centro',
          branchName: 'Morelia Centro'
        }
      ]

      setAssignedRequests(mockRequests)
      setLoading(false)
    }

    loadAssignedRequests()
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'asignada':
        return <ExclamationCircleIcon className="h-5 w-5 text-blue-500" />
      case 'en_proceso':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-500" />
      case 'resuelta':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'cerrada':
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
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

  // Filtrar solicitudes
  const filteredRequests = assignedRequests.filter(request => {
    const matchesStatus = selectedStatus === 'todas' || request.status === selectedStatus
    const matchesPriority = selectedPriority === 'todas' || request.priority === selectedPriority
    return matchesStatus && matchesPriority
  })

  // Estadísticas
  const stats = {
    total: assignedRequests.length,
    asignadas: assignedRequests.filter(r => r.status === 'asignada').length,
    enProceso: assignedRequests.filter(r => r.status === 'en_proceso').length,
    resueltas: assignedRequests.filter(r => r.status === 'resuelta').length,
    urgentes: assignedRequests.filter(r => r.priority === 'urgente').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botón de regresar */}
        <div className="mb-6">
          <BackButton href="/dashboard" label="Regresar al Dashboard" />
        </div>

        {/* Header del dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Vendedor
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus solicitudes asignadas y mantén contacto con tus clientes
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Asignadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nuevas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.asignadas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.enProceso}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resueltas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.resueltas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.urgentes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones rápidas */}
        <div className="mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/dashboard/vendedor/cotizaciones"
                className="btn-primary inline-flex items-center justify-center px-6 py-3"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Gestionar Cotizaciones
              </Link>
              
              <Link
                href="/contacto"
                className="btn-secondary inline-flex items-center justify-center px-6 py-3"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nueva Consulta
              </Link>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar Solicitudes</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="input-field"
              >
                <option value="todas">Todos los estados</option>
                <option value="asignada">Asignadas</option>
                <option value="en_proceso">En Proceso</option>
                <option value="resuelta">Resueltas</option>
                <option value="cerrada">Cerradas</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="input-field"
              >
                <option value="todas">Todas las prioridades</option>
                <option value="urgente">Urgente</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mis Solicitudes Asignadas</h2>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-12 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay solicitudes
              </h3>
              <p className="text-gray-600">
                {selectedStatus !== 'todas' || selectedPriority !== 'todas'
                  ? 'No hay solicitudes que coincidan con los filtros seleccionados'
                  : 'Aún no tienes solicitudes asignadas'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(request.status)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.companyName}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                          {request.priority}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {request.contactName}
                        </div>
                        <div className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-1" />
                          {request.email}
                        </div>
                        <div className="flex items-center">
                          <PhoneIcon className="h-4 w-4 mr-1" />
                          {request.phone}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {request.projectDescription}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {request.location}
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          {getBudgetLabel(request.estimatedBudget)}
                        </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Asignada: {format(request.assignedAt, 'dd MMM HH:mm', { locale: es })}
                        </div>
                        <span>🔍 {request.trackingId}</span>
                      </div>
                      
                      {request.lastContact && (
                        <div className="mt-2 text-sm text-green-600">
                          Último contacto: {format(request.lastContact, 'dd MMM HH:mm', { locale: es })}
                        </div>
                      )}
                      
                      {request.notes.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Notas:</p>
                          <div className="space-y-1">
                            {request.notes.slice(0, 2).map((note, index) => (
                              <p key={index} className="text-sm text-gray-600 bg-yellow-50 px-2 py-1 rounded">
                                • {note}
                              </p>
                            ))}
                            {request.notes.length > 2 && (
                              <p className="text-sm text-gray-500">
                                +{request.notes.length - 2} notas más
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2 ml-4">

                      
                      <button className="btn-secondary text-sm inline-flex items-center">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </button>
                      
                      {request.status === 'asignada' && (
                        <button className="btn-primary text-sm">
                          Iniciar Proceso
                        </button>
                      )}
                      
                      {request.status === 'en_proceso' && (
                        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm">
                          Marcar Resuelta
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips para vendedores */}
        <div className="mt-8 bg-primary-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 Tips para Vendedores
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">Gestión de Solicitudes:</h4>
              <ul className="space-y-1">
                <li>• Contacta al cliente dentro de las primeras 2 horas</li>
                <li>• Usa el chat para mantener comunicación fluida</li>
                <li>• Actualiza el estado según el progreso</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Mejores Prácticas:</h4>
              <ul className="space-y-1">
                <li>• Prioriza solicitudes urgentes y de alto valor</li>
                <li>• Documenta todas las interacciones importantes</li>
                <li>• Ofrece alternativas cuando no tengas el producto exacto</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}