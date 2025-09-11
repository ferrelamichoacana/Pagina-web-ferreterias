'use client'

import React from 'react'
import { useFirebaseStatus } from '@/lib/hooks/useFirebaseStatus'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'

export default function FirebaseStatusIndicator() {
  const status = useFirebaseStatus()

  const getStatusColor = () => {
    if (status.isConnected) return 'green'
    if (status.hasValidConfig) return 'yellow'
    return 'red'
  }

  const getStatusIcon = () => {
    const color = getStatusColor()
    const iconClass = `h-5 w-5`
    
    switch (color) {
      case 'green':
        return <CheckCircleIcon className={`${iconClass} text-green-600`} />
      case 'yellow':
        return <ExclamationTriangleIcon className={`${iconClass} text-yellow-600`} />
      case 'red':
        return <XCircleIcon className={`${iconClass} text-red-600`} />
      default:
        return <InformationCircleIcon className={`${iconClass} text-gray-600`} />
    }
  }

  const getStatusText = () => {
    if (status.isConnected) return 'Firebase Conectado'
    if (status.hasValidConfig) return 'Firebase Configurado (Faltan Env Vars)'
    return 'Firebase No Configurado'
  }

  const getBgColor = () => {
    const color = getStatusColor()
    switch (color) {
      case 'green': return 'bg-green-50 border-green-200'
      case 'yellow': return 'bg-yellow-50 border-yellow-200'
      case 'red': return 'bg-red-50 border-red-200'
      default: return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`border rounded-lg p-4 ${getBgColor()}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="font-medium text-gray-900">{getStatusText()}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          status.isConnected 
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}>
          {status.isConnected ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Detalles del estado */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Variables de entorno:</span>
          <span className={`font-medium ${status.hasValidEnvVars ? 'text-green-600' : 'text-red-600'}`}>
            {status.hasValidEnvVars ? '✓ Configuradas' : '✗ Faltantes'}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Firebase DB:</span>
          <span className={`font-medium ${status.hasValidConfig ? 'text-green-600' : 'text-red-600'}`}>
            {status.hasValidConfig ? '✓ Inicializada' : '✗ No inicializada'}
          </span>
        </div>

        {status.details.missingVars && status.details.missingVars.length > 0 && (
          <div className="mt-3 p-2 bg-red-100 rounded text-red-700 text-xs">
            <p className="font-medium">Variables faltantes o con valores dummy:</p>
            <ul className="mt-1 list-disc list-inside">
              {status.details.missingVars.map((varName: string) => (
                <li key={varName}>{varName}</li>
              ))}
            </ul>
            {status.details.vercelDeployment && (
              <p className="mt-2 text-blue-700">
                💡 En Vercel: Asegúrate de que las variables estén configuradas en el dashboard de Vercel
              </p>
            )}
          </div>
        )}

        {/* Información de entorno */}
        <div className="mt-3 p-2 bg-gray-100 rounded text-gray-700 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Entorno:</span> {status.details.environment}
            </div>
            <div>
              <span className="font-medium">Dominio:</span> {status.details.currentDomain}
            </div>
            <div>
              <span className="font-medium">Vercel:</span> {status.details.vercelDeployment ? 'Sí' : 'No'}
            </div>
            <div>
              <span className="font-medium">DB Init:</span> {status.details.dbInitialized ? 'Sí' : 'No'}
            </div>
          </div>
        </div>

        {status.error && (
          <div className="mt-3 p-2 bg-red-100 rounded text-red-700 text-xs">
            <p className="font-medium">Error:</p>
            <p>{status.error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
