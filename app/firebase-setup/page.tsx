'use client'

import React, { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import { useSimpleFirebaseData } from '@/lib/hooks/useSimpleFirebaseData'

export default function FirebaseSetupPage() {
  const { branches, brands, loading, usingMocks, refresh } = useSimpleFirebaseData()
  const [adding, setAdding] = useState(false)
  const [message, setMessage] = useState('')

  const addSampleBranches = async () => {
    if (!db) {
      setMessage('❌ Firebase no está configurado')
      return
    }

    setAdding(true)
    setMessage('🔄 Agregando sucursales...')

    try {
      const sampleBranches = [
        {
          customId: 'morelia-centro',
          name: 'Sucursal Morelia Centro',
          city: 'Morelia',
          state: 'Michoacán',
          address: 'Av. Madero #123, Centro Histórico',
          phone: '(443) 123-4567',
          email: 'morelia@ferreterialamichoacana.com',
          schedule: 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00, Dom: 9:00-15:00',
          coordinates: { lat: 19.7026, lng: -101.1947 },
          isMain: true,
          managerId: null,
          services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio', 'Asesoría técnica'],
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          customId: 'uruapan',
          name: 'Sucursal Uruapan',
          city: 'Uruapan',
          state: 'Michoacán',
          address: 'Blvd. Industrial #456, Col. Industrial',
          phone: '(452) 234-5678',
          email: 'uruapan@ferreterialamichoacana.com',
          schedule: 'Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00',
          coordinates: { lat: 19.4215, lng: -102.0630 },
          isMain: false,
          managerId: null,
          services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio'],
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const branchesRef = collection(db, 'branches')
      let added = 0

      for (const branch of sampleBranches) {
        try {
          await addDoc(branchesRef, branch)
          added++
        } catch (error) {
          console.error('Error adding branch:', error)
        }
      }

      setMessage(`✅ Se agregaron ${added} sucursales exitosamente`)
      refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setMessage(`❌ Error: ${errorMessage}`)
    } finally {
      setAdding(false)
    }
  }

  const addSampleBrands = async () => {
    if (!db) {
      setMessage('❌ Firebase no está configurado')
      return
    }

    setAdding(true)
    setMessage('🔄 Agregando marcas...')

    try {
      const sampleBrands = [
        {
          customId: '1',
          name: 'Häfele',
          logo: '/images/haefele_logo.png',
          category: 'Herrajes',
          featured: true,
          active: true,
          description: 'Herrajes de alta calidad',
          website: 'https://hafele.com',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          customId: '2',
          name: 'TRUPER',
          logo: '/images/logo_truper.png',
          category: 'Herramientas',
          featured: true,
          active: true,
          description: 'Herramientas profesionales',
          website: 'https://truper.com',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          customId: '3',
          name: 'DeWALT',
          logo: '/images/logo_dewalt.png',
          category: 'Herramientas Eléctricas',
          featured: true,
          active: true,
          description: 'Herramientas eléctricas profesionales',
          website: 'https://dewalt.com',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      const brandsRef = collection(db, 'brands')
      let added = 0

      for (const brand of sampleBrands) {
        try {
          await addDoc(brandsRef, brand)
          added++
        } catch (error) {
          console.error('Error adding brand:', error)
        }
      }

      setMessage(`✅ Se agregaron ${added} marcas exitosamente`)
      refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setMessage(`❌ Error: ${errorMessage}`)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔧 Configuración de Firebase
          </h1>

          {/* Estado de la conexión */}
          <div className="mb-8 p-4 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Estado de la Conexión</h2>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium">Firebase:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  db ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {db ? '✅ Conectado' : '❌ No conectado'}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">Datos:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  usingMocks ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                }`}>
                  {usingMocks ? '⚠️ Usando Mocks' : '✅ Desde Firestore'}
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          {db && (
            <div className="mb-8 p-4 rounded-lg border bg-blue-50">
              <h2 className="text-xl font-semibold mb-4">Inicializar Datos</h2>
              <div className="space-y-4">
                <button
                  onClick={addSampleBranches}
                  disabled={adding}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 mr-4"
                >
                  {adding ? '⏳ Agregando...' : '🏢 Agregar Sucursales'}
                </button>
                <button
                  onClick={addSampleBrands}
                  disabled={adding}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {adding ? '⏳ Agregando...' : '🏷️ Agregar Marcas'}
                </button>
              </div>
              {message && (
                <div className="mt-4 p-3 rounded bg-gray-100">
                  {message}
                </div>
              )}
            </div>
          )}

          {/* Datos actuales */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Sucursales */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                🏢 Sucursales ({branches.length})
              </h3>
              {loading ? (
                <div className="text-gray-500">Cargando...</div>
              ) : (
                <div className="space-y-2">
                  {branches.map(branch => (
                    <div key={branch.id} className="p-3 border rounded">
                      <div className="font-medium">{branch.name}</div>
                      <div className="text-sm text-gray-600">{branch.city}, {branch.state}</div>
                      <div className="text-sm text-gray-600">{branch.phone}</div>
                      {branch.isMain && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Marcas */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                🏷️ Marcas ({brands.length})
              </h3>
              {loading ? (
                <div className="text-gray-500">Cargando...</div>
              ) : (
                <div className="space-y-2">
                  {brands.map(brand => (
                    <div key={brand.id} className="p-3 border rounded">
                      <div className="font-medium">{brand.name}</div>
                      <div className="text-sm text-gray-600">{brand.category}</div>
                      {brand.featured && (
                        <span className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          Destacada
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instrucciones */}
          <div className="mt-8 p-4 rounded-lg border bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">📋 Instrucciones</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Verifica que Firebase esté conectado (verde)</li>
              <li>Si aparece "Usando Mocks", haz clic en los botones para agregar datos reales</li>
              <li>Una vez agregados los datos, refresca la página</li>
              <li>Los datos deberían aparecer desde Firestore</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
