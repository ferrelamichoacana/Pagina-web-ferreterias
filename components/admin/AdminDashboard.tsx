'use client'

import React, { useState } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import MaintenancePage from '@/components/ui/MaintenancePage'
import BackButton from '@/components/ui/BackButton'
import BranchesManager from './BranchesManager'
import BrandsManager from './BrandsManager'
import SystemConfigManager from './SystemConfigManager'
import UsersManager from './UsersManager'
import FileManagementPage from './FileManagementPage'
import FirebaseDebugger from './FirebaseDebugger'
import FirebaseSetup from './FirebaseSetup'
import SocialWidgetsManager from './SocialWidgetsManager'
import { 
  BuildingStorefrontIcon,
  TagIcon,
  CogIcon,
  UsersIcon,
  ChartBarIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  FireIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview')

  // Verificar permisos de administrador
  if (!user || (user.role !== 'admin' && user.role !== 'it')) {
    return (
      <MaintenancePage
        title="Acceso Restringido"
        message="Esta sección está disponible únicamente para administradores y personal de IT."
        showBackButton={true}
        contactInfo={false}
      />
    )
  }

  const tabs = [
    {
      id: 'overview',
      name: 'Resumen',
      icon: ChartBarIcon,
      description: 'Vista general del sistema'
    },
    {
      id: 'branches',
      name: 'Sucursales',
      icon: BuildingStorefrontIcon,
      description: 'Gestionar sucursales'
    },
    {
      id: 'brands',
      name: 'Marcas',
      icon: TagIcon,
      description: 'Gestionar marcas y logos'
    },
    {
      id: 'users',
      name: 'Usuarios',
      icon: UsersIcon,
      description: 'Gestionar usuarios y roles'
    },
    {
      id: 'config',
      name: 'Configuración',
      icon: CogIcon,
      description: 'Configuración del sistema'
    },
    {
      id: 'content',
      name: 'Contenido',
      icon: DocumentTextIcon,
      description: 'Gestionar contenido web'
    },
    {
      id: 'social-widgets',
      name: 'Redes Sociales',
      icon: DevicePhoneMobileIcon,
      description: 'Gestionar widgets de Facebook/Instagram'
    },
    {
      id: 'files',
      name: 'Archivos',
      icon: DocumentTextIcon,
      description: 'Gestión de archivos del sistema'
    },
    {
      id: 'debug',
      name: 'Firebase Debug',
      icon: WrenchScrewdriverIcon,
      description: 'Depurar colecciones de Firebase'
    },
    {
      id: 'firebase-setup',
      name: 'Configurar Firebase',
      icon: FireIcon,
      description: 'Configurar variables de entorno de Firebase'
    }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AdminOverview />
      case 'branches':
        return <BranchesManager />
      case 'brands':
        return <BrandsManager />
      case 'users':
        return <UsersManager />
      case 'config':
        return <SystemConfigManager />
      case 'content':
        return <ContentManager />
      case 'social-widgets':
        return <SocialWidgetsManager />
      case 'files':
        return <FileManagementPage />
      case 'debug':
        return <FirebaseDebugger />
      case 'firebase-setup':
        return <FirebaseSetup />
      default:
        return <AdminOverview />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
                <p className="text-gray-600">
                  Bienvenido, {user.displayName || user.email}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {user.role === 'admin' ? 'Administrador' : 'IT'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botón de regresar */}
        <div className="mb-6">
          <BackButton href="/dashboard" label="Regresar al Dashboard" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar de navegación */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-500'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div>
                      <div className="font-medium">{tab.name}</div>
                      <div className="text-xs text-gray-500">{tab.description}</div>
                    </div>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Contenido principal */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente de resumen
function AdminOverview() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Resumen del Sistema
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-primary-50 rounded-lg p-6">
          <div className="flex items-center">
            <BuildingStorefrontIcon className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-primary-600">Sucursales</p>
              <p className="text-2xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-6">
          <div className="flex items-center">
            <TagIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Marcas</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-6">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Usuarios</p>
              <p className="text-2xl font-semibold text-gray-900">5</p>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-yellow-600">Solicitudes</p>
              <p className="text-2xl font-semibold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="btn-primary text-left p-4">
            <BuildingStorefrontIcon className="h-5 w-5 mb-2" />
            <div className="font-medium">Agregar Sucursal</div>
            <div className="text-sm opacity-75">Crear nueva sucursal</div>
          </button>
          
          <button className="btn-secondary text-left p-4">
            <TagIcon className="h-5 w-5 mb-2" />
            <div className="font-medium">Agregar Marca</div>
            <div className="text-sm opacity-75">Subir nueva marca</div>
          </button>
          
          <button className="bg-accent-500 hover:bg-accent-600 text-white text-left p-4 rounded-lg">
            <CogIcon className="h-5 w-5 mb-2" />
            <div className="font-medium">Configuración</div>
            <div className="text-sm opacity-75">Ajustar sistema</div>
          </button>
        </div>
      </div>
    </div>
  )
}

// Placeholder para ContentManager
function ContentManager() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Gestión de Contenido
      </h2>
      <div className="text-center py-12">
        <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">
          Gestión de contenido web próximamente
        </p>
      </div>
    </div>
  )
}