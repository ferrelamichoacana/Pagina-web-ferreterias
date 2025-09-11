'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'

export function useFirebaseStatus() {
  const [status, setStatus] = useState({
    isConnected: false,
    hasValidConfig: false,
    hasValidEnvVars: false,
    error: null as string | null,
    details: {} as any
  })

  useEffect(() => {
    // Verificar variables de entorno
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
      'NEXT_PUBLIC_FIREBASE_APP_ID'
    ]

    const missingVars = requiredVars.filter(varName => !process.env[varName])
    const hasValidEnvVars = missingVars.length === 0

    // Verificar configuración de Firebase
    const hasValidConfig = !!db

    setStatus({
      isConnected: hasValidConfig && hasValidEnvVars,
      hasValidConfig,
      hasValidEnvVars,
      error: hasValidConfig ? null : 'Firebase no está configurado correctamente',
      details: {
        missingVars,
        dbInitialized: !!db,
        currentDomain: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
      }
    })
  }, [])

  return status
}
