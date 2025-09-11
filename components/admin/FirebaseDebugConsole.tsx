'use client'

import React, { useState, useEffect } from 'react'

export default function FirebaseDebugConsole() {
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    // Test completo de configuración
    const testFirebaseConfig = () => {
      // Variables de entorno
      const envVars = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      }

      // Test de importación de Firebase
      let firebaseImportStatus = null
      try {
        // Intentar importar Firebase de forma dinámica
        import('@/lib/firebase').then(firebase => {
          console.log('🔥 Firebase import successful:', firebase)
          setDebugInfo((prev: any) => ({
            ...prev,
            firebaseImportStatus: '✅ Firebase importado correctamente',
            firebaseDb: firebase.db ? '✅ DB inicializada' : '❌ DB no inicializada',
            firebaseAuth: firebase.auth ? '✅ Auth inicializada' : '❌ Auth no inicializada'
          }))
        }).catch(error => {
          console.error('❌ Firebase import failed:', error)
          setDebugInfo((prev: any) => ({
            ...prev,
            firebaseImportStatus: `❌ Error: ${error.message}`,
            firebaseError: error
          }))
        })
      } catch (error: any) {
        firebaseImportStatus = `❌ Error: ${error.message}`
      }

      // Información del entorno
      const environmentInfo = {
        nodeEnv: process.env.NODE_ENV,
        isClient: typeof window !== 'undefined',
        hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
        origin: typeof window !== 'undefined' ? window.location.origin : 'server',
        isVercel: typeof window !== 'undefined' ? window.location.hostname.includes('vercel.app') : false,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent.substring(0, 50) + '...' : 'server'
      }

      setDebugInfo({
        timestamp: new Date().toISOString(),
        environmentInfo,
        envVars,
        firebaseImportStatus: firebaseImportStatus || 'Probando...',
        envVarsStatus: {
          total: Object.keys(envVars).length,
          defined: Object.values(envVars).filter(v => v).length,
          missing: Object.entries(envVars).filter(([k, v]) => !v).map(([k]) => k)
        }
      })
    }

    testFirebaseConfig()
  }, [])

  if (!debugInfo) {
    return (
      <div className="bg-gray-100 border rounded-lg p-4 mb-6">
        <p className="text-gray-600">🔍 Ejecutando diagnóstico completo...</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-green-400 rounded-lg p-4 mb-6 font-mono text-sm overflow-auto max-h-96">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold">🔍 Firebase Debug Console</h3>
        <span className="text-gray-400 text-xs">{new Date(debugInfo.timestamp).toLocaleString()}</span>
      </div>

      {/* Environment Info */}
      <div className="mb-4">
        <h4 className="text-yellow-400 font-bold mb-2">🌍 ENVIRONMENT:</h4>
        <div className="pl-4 space-y-1">
          <div>NODE_ENV: <span className="text-white">{debugInfo.environmentInfo.nodeEnv}</span></div>
          <div>CLIENT: <span className="text-white">{debugInfo.environmentInfo.isClient ? 'YES' : 'NO'}</span></div>
          <div>HOSTNAME: <span className="text-white">{debugInfo.environmentInfo.hostname}</span></div>
          <div>VERCEL: <span className="text-white">{debugInfo.environmentInfo.isVercel ? 'YES' : 'NO'}</span></div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="mb-4">
        <h4 className="text-yellow-400 font-bold mb-2">📋 ENV VARIABLES ({debugInfo.envVarsStatus.defined}/{debugInfo.envVarsStatus.total}):</h4>
        <div className="pl-4 space-y-1">
          {Object.entries(debugInfo.envVars).map(([key, value]: [string, any]) => (
            <div key={key}>
              {key}: <span className={value ? 'text-green-400' : 'text-red-400'}>
                {value ? `${String(value).substring(0, 20)}...` : 'UNDEFINED'}
              </span>
            </div>
          ))}
        </div>
        {debugInfo.envVarsStatus.missing.length > 0 && (
          <div className="pl-4 mt-2">
            <span className="text-red-400">MISSING: {debugInfo.envVarsStatus.missing.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Firebase Status */}
      <div className="mb-4">
        <h4 className="text-yellow-400 font-bold mb-2">🔥 FIREBASE STATUS:</h4>
        <div className="pl-4 space-y-1">
          <div>IMPORT: <span className="text-white">{debugInfo.firebaseImportStatus}</span></div>
          {debugInfo.firebaseDb && <div>DATABASE: <span className="text-white">{debugInfo.firebaseDb}</span></div>}
          {debugInfo.firebaseAuth && <div>AUTH: <span className="text-white">{debugInfo.firebaseAuth}</span></div>}
          {debugInfo.firebaseError && (
            <div className="text-red-400 mt-2">
              ERROR: {debugInfo.firebaseError.message}
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div>
        <h4 className="text-yellow-400 font-bold mb-2">📝 DIAGNOSIS:</h4>
        <div className="pl-4 space-y-1 text-white">
          {debugInfo.envVarsStatus.defined === 0 && (
            <div className="text-red-400">❌ NO HAY VARIABLES DE ENTORNO DEFINIDAS</div>
          )}
          {debugInfo.envVarsStatus.defined > 0 && debugInfo.envVarsStatus.defined < 6 && (
            <div className="text-yellow-400">⚠️ VARIABLES PARCIALMENTE CONFIGURADAS</div>
          )}
          {debugInfo.envVarsStatus.defined === 6 && (
            <div className="text-green-400">✅ TODAS LAS VARIABLES CONFIGURADAS</div>
          )}
          {debugInfo.environmentInfo.isVercel && debugInfo.envVarsStatus.defined === 0 && (
            <div className="text-red-400">❌ VERCEL DEPLOY SIN VARIABLES - REDEPLOY NECESARIO</div>
          )}
        </div>
      </div>
    </div>
  )
}
