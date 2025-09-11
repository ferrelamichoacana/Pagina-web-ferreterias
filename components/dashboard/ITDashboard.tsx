'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import TicketManager from '@/components/it/TicketManager'
import MaintenancePage from '@/components/ui/MaintenancePage'
import { 
  WrenchScrewdriverIcon,
  ServerIcon,
  ChartBarIcon,
  CogIcon
} from '@heroicons/react/24/outline'

export default function ITDashboard() {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('tickets')

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

  if (!user || (user.role !== 'it' && user.role !== 'admin')) {
    return (
      <MaintenancePage
        title="Acceso Restringido"
        message="Esta sección está disponible solo para el personal de IT y administradores."
        showBackButton={true}
        contactInfo={false}
      />
    )
  }

  const tabs = [
    {
      id: 'tickets',
      name: 'Tickets de Soporte',
      icon: WrenchScrewdriverIcon,
      description: 'Gestión de solicitudes de soporte técnico'
    },
    {
      id: 'system',
      name: 'Estado del Sistema',
      icon: ServerIcon,
      description: 'Monitoreo de servidores y servicios'
    },
    {
      id: 'reports',
      name: 'Reportes',
      icon: ChartBarIcon,
      description: 'Estadísticas y análisis de rendimiento'
    },
    {
      id: 'settings',
      name: 'Configuración',
      icon: CogIcon,
      description: 'Configuración del sistema IT'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de IT</h1>
            <p className="text-gray-600 mt-2">
              Gestión técnica del sistema y soporte a sucursales
            </p>
          </div>

          {/* Navegación por pestañas */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`mr-2 h-5 w-5 ${
                      activeTab === tab.id ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {tab.name}
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Contenido de las pestañas */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {activeTab === 'tickets' && <TicketManager />}
            
            {activeTab === 'system' && (
              <div className="text-center py-12">
                <ServerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Estado del Sistema</h3>
                <p className="text-gray-500">Monitoreo de servidores en desarrollo</p>
              </div>
            )}
            
            {activeTab === 'reports' && (
              <div className="text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Reportes y Estadísticas</h3>
                <p className="text-gray-500">Análisis de rendimiento en desarrollo</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Configuración del Sistema</h3>
                <p className="text-gray-500">Configuraciones avanzadas en desarrollo</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}