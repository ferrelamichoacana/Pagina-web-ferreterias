'use client'

import React, { useState } from 'react'
import { 
  PlayIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  ClipboardDocumentIcon,
  ServerIcon
} from '@heroicons/react/24/outline'

export default function VercelEnvDebugger() {
  const [debugData, setDebugData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDebugTest = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/debug/env', {
        headers: {
          'Authorization': 'Bearer debug-admin'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setDebugData(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Debug API error:', err)
    } finally {
      setLoading(false)
    }
  }

  const testFirebaseAdmin = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/env', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer debug-admin'
        },
        body: JSON.stringify({ testType: 'firebase-admin' })
      })
      
      const result = await response.json()
      alert(result.success ? 
        '✅ Firebase Admin funciona correctamente!' : 
        `❌ Error Firebase Admin: ${result.error}`
      )
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="bg-white border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
          <ServerIcon className="h-5 w-5 text-blue-600" />
          <span>🔍 Vercel Runtime Debug</span>
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={runDebugTest}
            disabled={loading}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <PlayIcon className="h-4 w-4" />
            <span>{loading ? 'Ejecutando...' : 'Verificar Variables'}</span>
          </button>
          {debugData?.firebaseAdminTest && (
            <button
              onClick={testFirebaseAdmin}
              disabled={loading}
              className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
            >
              <span>Test Firebase Admin</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <XCircleIcon className="h-5 w-5 text-red-600" />
            <span className="text-red-800 font-medium">Error:</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {!debugData && !loading && (
        <div className="text-center py-8 text-gray-500">
          <ServerIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p>Ejecuta el test para verificar las variables de entorno en el servidor de Vercel</p>
        </div>
      )}

      {debugData && (
        <div className="space-y-6">
          {/* Resumen */}
          <div className={`p-4 rounded-lg ${
            debugData.debugInfo.allVariablesWorking 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2 mb-2">
              {debugData.debugInfo.allVariablesWorking ? (
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-600" />
              )}
              <span className={`font-medium ${
                debugData.debugInfo.allVariablesWorking ? 'text-green-800' : 'text-red-800'
              }`}>
                {debugData.stats.valid}/{debugData.stats.total} variables configuradas correctamente
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Válidas:</span>
                <span className="ml-1 font-medium text-green-600">{debugData.stats.valid}</span>
              </div>
              <div>
                <span className="text-gray-600">Faltantes:</span>
                <span className="ml-1 font-medium text-red-600">{debugData.stats.missing}</span>
              </div>
              <div>
                <span className="text-gray-600">Dummy:</span>
                <span className="ml-1 font-medium text-yellow-600">{debugData.stats.dummy}</span>
              </div>
              <div>
                <span className="text-gray-600">Vacías:</span>
                <span className="ml-1 font-medium text-gray-600">{debugData.stats.empty}</span>
              </div>
            </div>
          </div>

          {/* Runtime Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">🌐 Runtime Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Environment:</span>
                <span className="ml-1 font-medium">{debugData.runtimeInfo.nodeEnv}</span>
              </div>
              <div>
                <span className="text-gray-600">Vercel Env:</span>
                <span className="ml-1 font-medium">{debugData.runtimeInfo.vercelEnv}</span>
              </div>
              <div>
                <span className="text-gray-600">Region:</span>
                <span className="ml-1 font-medium">{debugData.runtimeInfo.vercelRegion}</span>
              </div>
              <div>
                <span className="text-gray-600">Node Version:</span>
                <span className="ml-1 font-medium">{debugData.runtimeInfo.nodeVersion}</span>
              </div>
              <div>
                <span className="text-gray-600">Platform:</span>
                <span className="ml-1 font-medium">{debugData.runtimeInfo.platform}</span>
              </div>
              <div>
                <span className="text-gray-600">Timestamp:</span>
                <span className="ml-1 font-medium">{new Date(debugData.runtimeInfo.timestamp).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Firebase Admin Test */}
          {debugData.firebaseAdminTest && (
            <div className="bg-orange-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">🔥 Firebase Admin Status</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  {debugData.firebaseAdminTest.hasCredentials ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-red-600" />
                  )}
                  <span>Credenciales</span>
                </div>
                <div className="flex items-center space-x-2">
                  {debugData.firebaseAdminTest.privateKeyFormat ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-red-600" />
                  )}
                  <span>Formato Private Key</span>
                </div>
                <div className="flex items-center space-x-2">
                  {debugData.firebaseAdminTest.canInitialize ? (
                    <CheckCircleIcon className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 text-red-600" />
                  )}
                  <span>Puede Inicializar</span>
                </div>
              </div>
            </div>
          )}

          {/* Variables Details */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">📋 Variables de Entorno</h4>
            <div className="space-y-2">
              {debugData.envStatus.map((env: any) => (
                <div key={env.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {env.valid ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    ) : env.exists ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <span className="font-medium text-gray-900">{env.key}</span>
                      <div className="text-xs text-gray-500">
                        Length: {env.length} | 
                        {env.isDummy && ' DUMMY |'}
                        {env.isEmpty && ' EMPTY |'}
                        {!env.exists && ' NOT_SET'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-mono text-gray-600">
                      {env.obfuscatedValue}
                    </span>
                    <button
                      onClick={() => copyToClipboard(env.obfuscatedValue)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <ClipboardDocumentIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Issues */}
          {debugData.debugInfo.criticalIssues.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-800 mb-3">🚨 Problemas Críticos</h4>
              <ul className="space-y-1">
                {debugData.debugInfo.criticalIssues.map((issue: any) => (
                  <li key={issue.key} className="text-red-700 text-sm">
                    • {issue.key}: {issue.exists ? 'Invalid format' : 'Missing'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
