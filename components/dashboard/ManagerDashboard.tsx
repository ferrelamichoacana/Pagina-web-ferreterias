'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MaintenancePage from '@/components/ui/MaintenancePage'
import { 
  DocumentTextIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CogIcon,
  EyeIcon,
  UserPlusIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ContactRequest {
  id: string
  trackingId: string
  companyName: string
  contactName: string
  email: string
  phone: string
  status: 'pendiente' | 'asignada' | 'en_proceso' | 'resuelta' | 'cerrada'
  priority: 'baja' | 'media' | 'alta' | 'urgente'
  createdAt: Date
  assignedTo?: string
  assignedToName?: string
  estimatedBudget: string
  projectDescription: string
}

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  status: 'activo' | 'inactivo'
  assignedRequests: number
  completedRequests: number
  averageResponseTime: number // en horas
  lastActivity: Date
}

export default function ManagerDashboard() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'solicitudes' | 'vendedores' | 'reportes'>('solicitudes')
  const [pendingRequests, setPendingRequests] = useState<ContactRequest[]>([])
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<string>('')

  // Cargar datos de la sucursal (simulado - en producción usar Firebase)
  useEffect(() => {
    const loadBranchData = async () => {
      if (!user?.branchId) {
        console.log('Usuario sin branchId asignado')
        return
      }

      // Simulación de solicitudes pendientes
      const mockPendingRequests: ContactRequest[] = [
        {
          id: '1',
          trackingId: 'REQ-2025-004',
          companyName: 'Constructora Nueva Era',
          contactName: 'Roberto Silva',
          email: 'roberto@nuevaera.com',
          phone: '(443) 234-5678',
          status: 'pendiente',
          priority: 'alta',
          createdAt: new Date(Date.now() - 30 * 60 * 1000),
          estimatedBudget: '500k-1m',
          projectDescription: 'Construcción de complejo habitacional. Necesito cotización para materiales de construcción en general.'
        },
        {
          id: '2',
          trackingId: 'REQ-2025-005',
          companyName: 'Reparaciones Express',
          contactName: 'Ana López',
          email: 'ana@reparacionesexpress.com',
          phone: '(443) 345-6789',
          status: 'pendiente',
          priority: 'media',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          estimatedBudget: '50k-100k',
          projectDescription: 'Reparación de techos en varias propiedades. Necesito láminas, tornillería y herramientas.'
        },
        {
          id: '3',
          trackingId: 'REQ-2025-006',
          companyName: 'Mantenimiento Industrial MX',
          contactName: 'Carlos Mendoza',
          email: 'carlos@mantenimientomx.com',
          phone: '(443) 456-7890',
          status: 'pendiente',
          priority: 'urgente',
          createdAt: new Date(Date.now() - 15 * 60 * 1000),
          estimatedBudget: 'mas-1m',
          projectDescription: 'Mantenimiento urgente de maquinaria industrial. Requiero soldadura, herramientas especializadas y repuestos.'
        }
      ]

      // Simulación de vendedores
      const mockVendors: Vendor[] = [
        {
          id: 'v1',
          name: 'Juan Pérez García',
          email: 'juan.perez@ferreteria.com',
          phone: '(443) 111-2222',
          status: 'activo',
          assignedRequests: 5,
          completedRequests: 23,
          averageResponseTime: 1.5,
          lastActivity: new Date(Date.now() - 30 * 60 * 1000)
        },
        {
          id: 'v2',
          name: 'María González López',
          email: 'maria.gonzalez@ferreteria.com',
          phone: '(443) 222-3333',
          status: 'activo',
          assignedRequests: 3,
          completedRequests: 18,
          averageResponseTime: 2.1,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: 'v3',
          name: 'Carlos Ramírez Ruiz',
          email: 'carlos.ramirez@ferreteria.com',
          phone: '(443) 333-4444',
          status: 'activo',
          assignedRequests: 7,
          completedRequests: 31,
          averageResponseTime: 0.8,
          lastActivity: new Date(Date.now() - 10 * 60 * 1000)
        }
      ]

      setPendingRequests(mockPendingRequests)
      setVendors(mockVendors)
      setLoading(false)
    }

    loadBranchData()
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

  if (!user || (user.role !== 'gerente' && user.role !== 'admin')) {
    return (
      <MaintenancePage
        title="Acceso Restringido"
        message="Esta sección está disponible solo para gerentes de sucursal y administradores."
        showBackButton={true}
        contactInfo={false}
      />
    )
  }

  const assignRequest = (requestId: string, vendorId: string) => {
    const vendor = vendors.find(v => v.id === vendorId)
    if (!vendor) return

    // En producción, esto se enviaría a Firebase
    console.log(`Assigning request ${requestId} to vendor ${vendorId}`)
    
    // Actualizar estado local
    setPendingRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: 'asignada' as const, assignedTo: vendorId, assignedToName: vendor.name }
          : req
      )
    )
    
    setVendors(prev =>
      prev.map(v =>
        v.id === vendorId
          ? { ...v, assignedRequests: v.assignedRequests + 1 }
          : v
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'asignada':
        return 'bg-blue-100 text-blue-800'
      case 'en_proceso':
        return 'bg-orange-100 text-orange-800'
      case 'resuelta':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  // Estadísticas
  const stats = {
    pendingRequests: pendingRequests.filter(r => r.status === 'pendiente').length,
    assignedRequests: pendingRequests.filter(r => r.status === 'asignada').length,
    activeVendors: vendors.filter(v => v.status === 'activo').length,
    totalRequests: pendingRequests.length,
    urgentRequests: pendingRequests.filter(r => r.priority === 'urgente').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Gerente
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona las solicitudes de tu sucursal y asigna vendedores
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Asignadas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.assignedRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendedores</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.activeVendors}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Hoy</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalRequests}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Urgentes</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.urgentRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('solicitudes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'solicitudes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5 inline mr-2" />
                Solicitudes Pendientes
              </button>
              <button
                onClick={() => setActiveTab('vendedores')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vendedores'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserGroupIcon className="h-5 w-5 inline mr-2" />
                Gestión de Vendedores
              </button>
              <button
                onClick={() => setActiveTab('reportes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'reportes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ChartBarIcon className="h-5 w-5 inline mr-2" />
                Reportes y Métricas
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de tabs */}
        {activeTab === 'solicitudes' ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Solicitudes Pendientes de Asignación</h2>
            </div>
            
            {loading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : pendingRequests.filter(r => r.status === 'pendiente').length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  ¡Excelente trabajo!
                </h3>
                <p className="text-gray-600">
                  No hay solicitudes pendientes de asignación
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingRequests.filter(r => r.status === 'pendiente').map((request) => (
                  <div key={request.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <BuildingOfficeIcon className="h-5 w-5 text-primary-600" />
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
                          <span>👤 {request.contactName}</span>
                          <span>📧 {request.email}</span>
                          <span>📞 {request.phone}</span>
                          <span>💰 {getBudgetLabel(request.estimatedBudget)}</span>
                        </div>
                        
                        <p className="text-gray-700 mb-3 line-clamp-2">
                          {request.projectDescription}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {format(request.createdAt, 'dd MMM HH:mm', { locale: es })}</span>
                          <span>🔍 {request.trackingId}</span>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4 min-w-48">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Asignar a vendedor:
                          </label>
                          <select
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                            className="w-full input-field text-sm"
                          >
                            <option value="">Seleccionar vendedor</option>
                            {vendors.filter(v => v.status === 'activo').map(vendor => (
                              <option key={vendor.id} value={vendor.id}>
                                {vendor.name} ({vendor.assignedRequests} asignadas)
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              if (selectedVendor) {
                                assignRequest(request.id, selectedVendor)
                                setSelectedVendor('')
                              }
                            }}
                            disabled={!selectedVendor}
                            className={`flex-1 text-sm px-3 py-2 rounded-lg ${
                              selectedVendor
                                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                          >
                            Asignar
                          </button>
                          
                          <button className="btn-secondary text-sm">
                            <EyeIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'vendedores' ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Equipo de Vendedores</h2>
              <button className="btn-primary inline-flex items-center text-sm">
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Agregar Vendedor
              </button>
            </div>
            
            <div className="divide-y divide-gray-200">
              {vendors.map((vendor) => (
                <div key={vendor.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-lg">
                          {vendor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📧 {vendor.email}</span>
                          <span>📞 {vendor.phone}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            vendor.status === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {vendor.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{vendor.assignedRequests}</p>
                          <p className="text-gray-600">Asignadas</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{vendor.completedRequests}</p>
                          <p className="text-gray-600">Completadas</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-gray-900">{vendor.averageResponseTime}h</p>
                          <p className="text-gray-600">Resp. Promedio</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Última actividad: {format(vendor.lastActivity, 'dd MMM HH:mm', { locale: es })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Reportes y Métricas</h2>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Métricas de rendimiento */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Rendimiento del Equipo</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tiempo promedio de respuesta:</span>
                      <span className="font-medium">1.5 horas</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasa de resolución:</span>
                      <span className="font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Satisfacción del cliente:</span>
                      <span className="font-medium">4.6/5</span>
                    </div>
                  </div>
                </div>
                
                {/* Estadísticas de la semana */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4">Esta Semana</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solicitudes recibidas:</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Solicitudes resueltas:</span>
                      <span className="font-medium">21</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ventas generadas:</span>
                      <span className="font-medium">$2,450,000</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Gráfico placeholder */}
              <div className="mt-6 bg-gray-50 p-8 rounded-lg text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Gráficos de Rendimiento
                </h3>
                <p className="text-gray-600">
                  Los gráficos detallados estarán disponibles próximamente
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}