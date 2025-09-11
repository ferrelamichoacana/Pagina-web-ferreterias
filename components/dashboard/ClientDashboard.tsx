'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { useContactRequests } from '@/lib/hooks/useFirebaseData'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MaintenancePage from '@/components/ui/MaintenancePage'
import { 
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  EyeIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'


export default function ClientDashboard() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const [userRequests, setUserRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Obtener solicitudes del usuario actual
  useEffect(() => {
    if (user?.email) {
      // Por ahora filtraremos por email ya que no todos los requests tienen userId
      fetch(`/api/user-requests?email=${encodeURIComponent(user.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUserRequests(data.requests)
          }
          setLoading(false)
        })
        .catch(error => {
          console.error('Error fetching user requests:', error)
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [user])

  // Verificar si el usuario está autenticado
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

  if (!user) {
    return (
      <MaintenancePage
        title="Acceso Requerido"
        message="Necesitas iniciar sesión para acceder a tu panel de usuario."
        showBackButton={true}
        contactInfo={false}
      />
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendiente':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'asignada':
        return <ExclamationCircleIcon className="h-5 w-5 text-blue-500" />
      case 'en_proceso':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-500" />
      case 'resuelta':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'Pendiente de Asignación'
      case 'asignada':
        return 'Asignada a Vendedor'
      case 'en_proceso':
        return 'En Proceso'
      case 'resuelta':
        return 'Resuelta'
      default:
        return 'Desconocido'
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Bienvenido, {user.displayName || user.email}
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona tus solicitudes de cotización y mantente en contacto con nuestros vendedores.
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Solicitudes</p>
                <p className="text-2xl font-semibold text-gray-900">{userRequests.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userRequests.filter(r => r.status === 'pendiente').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userRequests.filter(r => r.status === 'en_proceso').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resueltas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {userRequests.filter(r => r.status === 'resuelta').length}
                </p>
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
                href="/contacto"
                className="btn-primary inline-flex items-center justify-center px-6 py-3"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Nueva Solicitud de Cotización
              </Link>
              
              <Link
                href="/profile"
                className="btn-secondary inline-flex items-center justify-center px-6 py-3"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Editar Perfil
              </Link>
              
              <Link
                href="/sucursales"
                className="btn-secondary inline-flex items-center justify-center px-6 py-3"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                Ver Sucursales
              </Link>
            </div>
          </div>
        </div>

        {/* Lista de solicitudes */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Mis Solicitudes</h2>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : userRequests.length === 0 ? (
            <div className="p-12 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tienes solicitudes aún
              </h3>
              <p className="text-gray-600 mb-6">
                Crea tu primera solicitud de cotización para comenzar.
              </p>
              <Link
                href="/contacto"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Crear Primera Solicitud
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {userRequests.map((request) => (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getStatusIcon(request.status)}
                        <h3 className="text-lg font-medium text-gray-900">
                          {request.companyName}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {request.projectDescription}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>📍 {request.location}</span>
                        {request.estimatedBudget && (
                          <span>💰 {request.estimatedBudget}</span>
                        )}
                        <span>📅 {format(new Date(request.createdAt), 'dd MMM yyyy', { locale: es })}</span>
                        {request.trackingId && (
                          <span>🔍 {request.trackingId}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">

                      
                      <button className="btn-secondary text-sm">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}