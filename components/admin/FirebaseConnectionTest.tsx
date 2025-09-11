'use client'

import React, { useState, useEffect } from 'react'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function FirebaseConnectionTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing')
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    testFirebaseConnection()
  }, [])

  const testFirebaseConnection = async () => {
    const results: any[] = []
    
    // Test 1: Verificar si db está configurado
    results.push({
      test: 'Firebase DB Configuration',
      status: db ? '✅' : '❌',
      result: db ? 'DB configurada correctamente' : 'DB no configurada'
    })

    if (!db) {
      setConnectionStatus('error')
      setError('Firebase no está configurado')
      setTestResults(results)
      return
    }

    try {
      // Test 2: Intentar leer la colección brands
      console.log('🧪 Testing Firebase read...')
      const brandsRef = collection(db, 'brands')
      const snapshot = await getDocs(brandsRef)
      
      results.push({
        test: 'Read Brands Collection',
        status: '✅',
        result: `${snapshot.size} documentos encontrados`
      })

      // Test 3: Intentar escribir un documento de prueba
      console.log('🧪 Testing Firebase write...')
      const testDoc = {
        name: 'Test Brand',
        category: 'Test Category',
        active: true,
        createdAt: new Date(),
        isTest: true
      }
      
      const docRef = await addDoc(brandsRef, testDoc)
      
      results.push({
        test: 'Write Test Document',
        status: '✅',
        result: `Documento creado con ID: ${docRef.id}`
      })

      setConnectionStatus('connected')
      console.log('✅ Firebase connection successful')
      
    } catch (err) {
      console.error('❌ Firebase connection failed:', err)
      results.push({
        test: 'Firebase Operations',
        status: '❌',
        result: err instanceof Error ? err.message : 'Error desconocido'
      })
      
      setConnectionStatus('error')
      setError(err instanceof Error ? err.message : 'Error de conexión')
    }

    setTestResults(results)
  }

  const retryConnection = () => {
    setConnectionStatus('testing')
    setError(null)
    setTestResults([])
    testFirebaseConnection()
  }

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          🔥 Test de Conexión Firebase
        </h3>
        <button
          onClick={retryConnection}
          disabled={connectionStatus === 'testing'}
          className="btn-secondary text-sm"
        >
          {connectionStatus === 'testing' ? 'Probando...' : 'Reintentar'}
        </button>
      </div>

      {/* Estado general */}
      <div className={`p-3 rounded-lg mb-4 ${
        connectionStatus === 'connected' 
          ? 'bg-green-50 border border-green-200' 
          : connectionStatus === 'error'
          ? 'bg-red-50 border border-red-200'
          : 'bg-blue-50 border border-blue-200'
      }`}>
        <p className={`font-medium ${
          connectionStatus === 'connected' 
            ? 'text-green-800' 
            : connectionStatus === 'error'
            ? 'text-red-800'
            : 'text-blue-800'
        }`}>
          {connectionStatus === 'connected' && '✅ Conexión exitosa'}
          {connectionStatus === 'error' && '❌ Error de conexión'}
          {connectionStatus === 'testing' && '🔄 Probando conexión...'}
        </p>
        {error && (
          <p className="text-red-700 text-sm mt-1">{error}</p>
        )}
      </div>

      {/* Resultados detallados */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-700">Resultados de Pruebas:</h4>
        {testResults.map((result, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-700">{result.test}</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{result.status}</span>
              <span className="text-xs text-gray-600">{result.result}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Variables de entorno */}
      <div className="mt-4 pt-4 border-t">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Variables de Entorno:</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Configurada' : '❌ Faltante'}</div>
          <div>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '❌ Faltante'}</div>
          <div>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Configurada' : '❌ Faltante'}</div>
        </div>
      </div>
    </div>
  )
}
