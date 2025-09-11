'use client'

import React, { useState } from 'react'
import { 
  ClipboardDocumentIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon 
} from '@heroicons/react/24/outline'

export default function FirebaseSetup() {
  const [copied, setCopied] = useState('')
  const [envVars, setEnvVars] = useState({
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    privateKey: '',
    clientEmail: ''
  })

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const generateEnvFile = () => {
    const envContent = `# Firebase Configuration - Proyecto: ${envVars.projectId}
# Estas variables son seguras para exponer públicamente
NEXT_PUBLIC_FIREBASE_API_KEY=${envVars.apiKey}
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${envVars.authDomain}
NEXT_PUBLIC_FIREBASE_PROJECT_ID=${envVars.projectId}
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${envVars.storageBucket}
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${envVars.messagingSenderId}
NEXT_PUBLIC_FIREBASE_APP_ID=${envVars.appId}

# Firebase Admin (Server-side) - PRIVADAS
FIREBASE_PRIVATE_KEY="${envVars.privateKey}"
FIREBASE_CLIENT_EMAIL=${envVars.clientEmail}

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dino-cloudinary
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your_secret_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000`

    const blob = new Blob([envContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.env.local'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          🔥 Configuración de Firebase
        </h1>
        <p className="text-gray-600">
          Sigue estos pasos para configurar Firebase correctamente en tu proyecto.
        </p>
      </div>

      {/* Estado actual de las variables */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mt-1" />
          <div>
            <h3 className="font-medium text-yellow-800">Variables de Firebase faltantes</h3>
            <p className="text-yellow-700 text-sm mt-1">
              Necesitas configurar las variables de entorno para que Firebase funcione correctamente.
            </p>
          </div>
        </div>
      </div>

      {/* Paso 1: Obtener configuración */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Paso 1: Obtener configuración de Firebase
        </h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-800 font-medium">Para obtener tu configuración:</p>
                <ol className="text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Ve a <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline">Firebase Console</a></li>
                  <li>Selecciona tu proyecto "website-ferreteria"</li>
                  <li>Haz clic en ⚙️ (Configuración del proyecto)</li>
                  <li>Ve a la pestaña "General"</li>
                  <li>En "Tus aplicaciones", busca tu app web</li>
                  <li>Haz clic en "Configuración" y copia los valores</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Formulario para capturar configuración */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={envVars.apiKey}
                onChange={(e) => setEnvVars({...envVars, apiKey: e.target.value})}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                value={envVars.authDomain}
                onChange={(e) => setEnvVars({...envVars, authDomain: e.target.value})}
                placeholder="your-project.firebaseapp.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project ID
              </label>
              <input
                type="text"
                value={envVars.projectId}
                onChange={(e) => setEnvVars({...envVars, projectId: e.target.value})}
                placeholder="website-ferreteria"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Storage Bucket
              </label>
              <input
                type="text"
                value={envVars.storageBucket}
                onChange={(e) => setEnvVars({...envVars, storageBucket: e.target.value})}
                placeholder="your-project.appspot.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={envVars.messagingSenderId}
                onChange={(e) => setEnvVars({...envVars, messagingSenderId: e.target.value})}
                placeholder="123456789"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                App ID
              </label>
              <input
                type="text"
                value={envVars.appId}
                onChange={(e) => setEnvVars({...envVars, appId: e.target.value})}
                placeholder="1:123456789:web:abc123"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Paso 2: Configuración de Admin SDK */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Paso 2: Configuración Admin SDK (para API server-side)
        </h2>
        
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="text-sm">
                <p className="text-red-800 font-medium">⚠️ Estas credenciales son privadas y sensibles</p>
                <ol className="text-red-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Ve a Firebase Console → Configuración del proyecto</li>
                  <li>Pestaña "Cuentas de servicio"</li>
                  <li>Haz clic en "Generar nueva clave privada"</li>
                  <li>Descarga el archivo JSON</li>
                  <li>Copia "private_key" y "client_email" del JSON</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Private Key (del JSON descargado)
              </label>
              <textarea
                value={envVars.privateKey}
                onChange={(e) => setEnvVars({...envVars, privateKey: e.target.value})}
                placeholder="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Email (del JSON descargado)
              </label>
              <input
                type="text"
                value={envVars.clientEmail}
                onChange={(e) => setEnvVars({...envVars, clientEmail: e.target.value})}
                placeholder="firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Paso 3: Generar archivo .env.local */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Paso 3: Generar archivo .env.local
        </h2>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Una vez que hayas completado los campos arriba, descarga el archivo .env.local:
          </p>
          
          <button
            onClick={generateEnvFile}
            disabled={!envVars.apiKey || !envVars.projectId}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <ClipboardDocumentIcon className="h-5 w-5" />
            <span>Descargar .env.local</span>
          </button>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Instrucciones:</strong>
            </p>
            <ol className="text-sm text-gray-600 mt-2 space-y-1 list-decimal list-inside">
              <li>Descarga el archivo .env.local</li>
              <li>Colócalo en la raíz de tu proyecto (mismo nivel que package.json)</li>
              <li>Reinicia el servidor de desarrollo: <code className="bg-gray-200 px-1 rounded">npm run dev</code></li>
              <li>Verifica que Firebase esté funcionando</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Comando para crear índice */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Paso 4: Crear índices de Firebase (Opcional)
        </h2>
        
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Si ves errores sobre índices faltantes, usa este enlace:
          </p>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <code className="text-sm text-gray-800 break-all">
                https://console.firebase.google.com/v1/r/project/website-ferreteria/firestore/indexes
              </code>
              <button
                onClick={() => copyToClipboard('https://console.firebase.google.com/v1/r/project/website-ferreteria/firestore/indexes', 'index-url')}
                className="ml-2 p-1 text-gray-400 hover:text-gray-600"
              >
                {copied === 'index-url' ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <ClipboardDocumentIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600">
            O simplemente haz clic en los enlaces que aparecen en los errores de la consola para crear los índices automáticamente.
          </p>
        </div>
      </div>
    </div>
  )
}
