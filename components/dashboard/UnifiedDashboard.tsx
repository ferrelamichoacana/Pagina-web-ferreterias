'use client'

import React from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BackButton from '@/components/ui/BackButton'
import Link from 'next/link'
import { 
  UserCircleIcon,
  CogIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  WrenchScrewdriverIcon,
  ShoppingCartIcon,
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function UnifiedDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Definir paneles disponibles según el rol
  const availablePanels = [
    // Panel básico de usuario (todos los roles)
    {
      id: 'profile',
      title: 'Mi Perfil',
      description: 'Gestiona tu información personal y configuración',
      href: '/profile',
      icon: UserCircleIcon,
      color: 'bg-blue-500',
      roles: ['cliente', 'vendedor', 'gerente', 'rrhh', 'it', 'admin']
    },
    // Panel de cliente
    {
      id: 'client',
      title: 'Panel de Cliente',
      description: 'Mis solicitudes, cotizaciones y comunicación',
      href: '/dashboard/cliente',
      icon: ShoppingCartIcon,
      color: 'bg-green-500',
      roles: ['cliente']
    },
    // Panel de vendedor
    {
      id: 'vendor',
      title: 'Panel de Vendedor',
      description: 'Gestión de clientes, cotizaciones y ventas',
      href: '/dashboard/vendedor',
      icon: DocumentTextIcon,
      color: 'bg-purple-500',
      roles: ['vendedor', 'gerente', 'admin']
    },
    // Panel de gerente
    {
      id: 'manager',
      title: 'Panel de Gerente',
      description: 'Gestión de sucursal, equipo y reportes',
      href: '/dashboard/gerente',
      icon: BuildingOfficeIcon,
      color: 'bg-orange-500',
      roles: ['gerente', 'admin']
    },
    // Panel de RRHH
    {
      id: 'hr',
      title: 'Panel de RRHH',
      description: 'Sistema ATS, vacantes y gestión de personal',
      href: '/dashboard/rrhh',
      icon: UserGroupIcon,
      color: 'bg-pink-500',
      roles: ['rrhh', 'admin']
    },
    // Panel de IT
    {
      id: 'it',
      title: 'Panel de IT',
      description: 'Tickets de soporte, sistema y monitoreo',
      href: '/dashboard/it',
      icon: WrenchScrewdriverIcon,
      color: 'bg-indigo-500',
      roles: ['it', 'admin']
    },
    // Panel de administrador
    {
      id: 'admin',
      title: 'Panel de Administrador',
      description: 'Configuración del sistema y gestión completa',
      href: '/dashboard/admin',
      icon: CogIcon,
      color: 'bg-red-500',
      roles: ['admin']
    }
  ]

  // Filtrar paneles según el rol del usuario
  const userPanels = availablePanels.filter(panel => 
    panel.roles.includes(user.role)
  )

  // Panel principal según el rol
  const primaryPanel = (() => {
    switch (user.role) {
      case 'admin':
        return availablePanels.find(p => p.id === 'admin')
      case 'it':
        return availablePanels.find(p => p.id === 'it')
      case 'rrhh':
        return availablePanels.find(p => p.id === 'hr')
      case 'gerente':
        return availablePanels.find(p => p.id === 'manager')
      case 'vendedor':
        return availablePanels.find(p => p.id === 'vendor')
      default:
        return availablePanels.find(p => p.id === 'client')
    }
  })()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Botón de regresar */}
          <div className="mb-8">
            <BackButton href="/" label="Regresar al Inicio" />
          </div>

          {/* Bienvenida */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              ¡Bienvenido, {user.displayName || user.email}!
            </h1>
            <p className="text-lg text-gray-600">
              Selecciona el panel que deseas usar
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                Rol: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>

          {/* Panel principal destacado */}
          {primaryPanel && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Panel Principal</h2>
              <Link
                href={primaryPanel.href}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-8 hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="flex items-center">
                  <div className={`${primaryPanel.color} p-4 rounded-lg`}>
                    <primaryPanel.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900 group-hover:text-primary-600">
                      {primaryPanel.title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {primaryPanel.description}
                    </p>
                  </div>
                  <ArrowRightIcon className="h-6 w-6 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </Link>
            </div>
          )}

          {/* Otros paneles disponibles */}
          {userPanels.length > 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Otros Paneles Disponibles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPanels
                  .filter(panel => panel.id !== primaryPanel?.id)
                  .map((panel) => (
                    <Link
                      key={panel.id}
                      href={panel.href}
                      className="block bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group"
                    >
                      <div className="flex items-center mb-4">
                        <div className={`${panel.color} p-3 rounded-lg`}>
                          <panel.icon className="h-6 w-6 text-white" />
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-200 ml-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2">
                        {panel.title}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {panel.description}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {/* Acciones rápidas */}
          <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/contacto"
                className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mr-3" />
                Solicitar Cotización
              </Link>
              <Link
                href="/empleos"
                className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                Ver Empleos
              </Link>
              <Link
                href="/sucursales"
                className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-3" />
                Nuestras Sucursales
              </Link>
              <Link
                href="/profile"
                className="flex items-center p-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <UserCircleIcon className="h-5 w-5 text-gray-400 mr-3" />
                Editar Perfil
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}