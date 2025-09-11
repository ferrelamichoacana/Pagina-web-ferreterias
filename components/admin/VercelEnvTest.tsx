'use client'

import React, { useState, useEffect } from 'react'
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClipboardDocumentIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function VercelEnvTest() {
  const [envStatus, setEnvStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const checkEnvVars = () => {
    setLoading(true)
    
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]

    const status = requiredVars.map(varName => {
      const value = process.env[varName]
      const exists = !!value
      const isDummy = value && (value.includes('dummy') || value === 'your_' || value.startsWith('your_'))
      
      return {
        name: varName,
        value: value || 'Not set',
        exists,
        isDummy,
        valid: exists && !isDummy,
        obfuscated: value ? value.substring(0, 10) + '...' : 'Not set'
      }
    })

    const allValid = status.every(s => s.valid)
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')

    setEnvStatus({
      variables: status,
      allValid,
      isVercel,
      totalVars: status.length,
      validVars: status.filter(s => s.valid).length,
      timestamp: new Date().toISOString()
    })

    setLoading(false)
  }

  useEffect(() => {
    checkEnvVars()
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          🔍 Test de Variables de Entorno
        </h3>
        <button
          onClick={checkEnvVars}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
        >
          <ArrowPathIcon className="h-4 w-4" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Resumen */}
      <div className={`p-3 rounded-lg mb-4 ${
        envStatus.allValid 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center space-x-2">
          {envStatus.allValid ? (
            <CheckCircleIcon className="h-5 w-5 text-green-600" />
          ) : (
            <XCircleIcon className="h-5 w-5 text-red-600" />
          )}
          <span className={`font-medium ${
            envStatus.allValid ? 'text-green-800' : 'text-red-800'
          }`}>
            {envStatus.allValid 
              ? '✅ Todas las variables están configuradas correctamente'
              : `❌ ${envStatus.validVars}/${envStatus.totalVars} variables configuradas`
            }
          </span>
        </div>
        
        {envStatus.isVercel && (
          <p className="text-sm text-blue-700 mt-2">
            🌐 Ejecutándose en Vercel - Las variables deberían estar disponibles
          </p>
        )}
      </div>

      {/* Lista de variables */}
      <div className="space-y-2">
        {envStatus.variables.map((variable: any) => (
          <div key={variable.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center space-x-2">
              {variable.valid ? (
                <CheckCircleIcon className="h-4 w-4 text-green-600" />
              ) : (
                <XCircleIcon className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm font-mono text-gray-800">
                {variable.name}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded ${
                variable.valid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {variable.valid ? 'OK' : variable.isDummy ? 'DUMMY' : 'MISSING'}
              </span>
              
              {variable.exists && (
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600 font-mono">
                    {variable.obfuscated}
                  </span>
                  <button
                    onClick={() => copyToClipboard(variable.value)}
                    className="text-gray-400 hover:text-gray-600"
                    title="Copiar valor completo"
                  >
                    <ClipboardDocumentIcon className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Instrucciones para Vercel */}
      {!envStatus.allValid && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <h4 className="font-medium text-blue-800 mb-2">
            🔧 Para configurar en Vercel:
          </h4>
          <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
            <li>Ve al dashboard de Vercel → tu proyecto</li>
            <li>Settings → Environment Variables</li>
            <li>Agrega cada variable con el prefijo NEXT_PUBLIC_</li>
            <li>Redeploya el proyecto</li>
          </ol>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500">
        Última verificación: {new Date(envStatus.timestamp).toLocaleString()}
      </div>
    </div>
  )
}
