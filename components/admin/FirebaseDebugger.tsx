'use client'

import React, { useState, useEffect } from 'react'
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  DocumentTextIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface FirestoreDocument {
  id: string
  [key: string]: any
}

export default function FirebaseDebugger() {
  const [selectedCollection, setSelectedCollection] = useState('')
  const [documents, setDocuments] = useState<FirestoreDocument[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<FirestoreDocument | null>(null)
  const [viewingDoc, setViewingDoc] = useState<FirestoreDocument | null>(null)
  const [formData, setFormData] = useState('')

  // Colecciones disponibles en la aplicación
  const collections = [
    'users',
    'branches', 
    'brands',
    'contactRequests',
    'jobPostings',
    'jobApplications',
    'itTickets',
    'chatMessages',
    'systemConfig',
    'systemLogs'
  ]

  const clearMessages = () => {
    setError(null)
    setSuccess(null)
  }

  const loadCollection = async (collectionName: string) => {
    if (!collectionName) return

    setLoading(true)
    clearMessages()
    
    try {
      const q = query(collection(db, collectionName))
      const querySnapshot = await getDocs(q)
      
      const docs: FirestoreDocument[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        // Convertir Timestamps a strings para visualización
        const processedData = Object.keys(data).reduce((acc, key) => {
          const value = data[key]
          if (value && typeof value === 'object' && value.toDate) {
            acc[key] = value.toDate().toISOString()
          } else {
            acc[key] = value
          }
          return acc
        }, {} as any)
        
        docs.push({
          id: doc.id,
          ...processedData
        })
      })
      
      setDocuments(docs)
      setSuccess(`Cargados ${docs.length} documentos de ${collectionName}`)
    } catch (err) {
      console.error('Error loading collection:', err)
      setError(`Error al cargar colección: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCollectionChange = (collectionName: string) => {
    setSelectedCollection(collectionName)
    setDocuments([])
    setEditingDoc(null)
    setViewingDoc(null)
    setShowAddForm(false)
    clearMessages()
    
    if (collectionName) {
      loadCollection(collectionName)
    }
  }

  const handleAddDocument = async () => {
    if (!selectedCollection || !formData.trim()) {
      setError('Colección y datos son requeridos')
      return
    }

    setLoading(true)
    clearMessages()

    try {
      const data = JSON.parse(formData)
      
      // Agregar timestamps automáticamente
      const docData = {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, selectedCollection), docData)
      setSuccess(`Documento creado con ID: ${docRef.id}`)
      setFormData('')
      setShowAddForm(false)
      
      // Recargar la colección
      await loadCollection(selectedCollection)
    } catch (err) {
      console.error('Error adding document:', err)
      setError(`Error al agregar documento: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDocument = async () => {
    if (!selectedCollection || !editingDoc || !formData.trim()) {
      setError('Datos requeridos para actualizar')
      return
    }

    setLoading(true)
    clearMessages()

    try {
      const data = JSON.parse(formData)
      
      // Mantener ID y agregar timestamp de actualización
      const { id, ...updateData } = data
      const docData = {
        ...updateData,
        updatedAt: new Date()
      }
      
      await updateDoc(doc(db, selectedCollection, editingDoc.id), docData)
      setSuccess(`Documento ${editingDoc.id} actualizado`)
      setFormData('')
      setEditingDoc(null)
      
      // Recargar la colección
      await loadCollection(selectedCollection)
    } catch (err) {
      console.error('Error updating document:', err)
      setError(`Error al actualizar documento: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDocument = async (docId: string) => {
    if (!selectedCollection || !window.confirm(`¿Eliminar documento ${docId}?`)) {
      return
    }

    setLoading(true)
    clearMessages()

    try {
      await deleteDoc(doc(db, selectedCollection, docId))
      setSuccess(`Documento ${docId} eliminado`)
      
      // Recargar la colección
      await loadCollection(selectedCollection)
    } catch (err) {
      console.error('Error deleting document:', err)
      setError(`Error al eliminar documento: ${err instanceof Error ? err.message : 'Error desconocido'}`)
    } finally {
      setLoading(false)
    }
  }

  const startEdit = (document: FirestoreDocument) => {
    setEditingDoc(document)
    setFormData(JSON.stringify(document, null, 2))
    setShowAddForm(false)
    setViewingDoc(null)
    clearMessages()
  }

  const startAdd = () => {
    setShowAddForm(true)
    setEditingDoc(null)
    setViewingDoc(null)
    setFormData('{\n  \n}')
    clearMessages()
  }

  const viewDocument = (document: FirestoreDocument) => {
    setViewingDoc(document)
    setEditingDoc(null)
    setShowAddForm(false)
    clearMessages()
  }

  const cancelEdit = () => {
    setEditingDoc(null)
    setShowAddForm(false)
    setViewingDoc(null)
    setFormData('')
    clearMessages()
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Firebase Debugger</h2>
          <p className="text-gray-600 mt-1">Consulta y modifica colecciones de Firestore</p>
        </div>
        
        {selectedCollection && (
          <button
            onClick={() => loadCollection(selectedCollection)}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Recargar</span>
          </button>
        )}
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
          <span className="text-red-800">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center space-x-2">
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
          <span className="text-green-800">{success}</span>
        </div>
      )}

      {/* Selector de colección */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Colección
        </label>
        <div className="flex items-center space-x-4">
          <select
            value={selectedCollection}
            onChange={(e) => handleCollectionChange(e.target.value)}
            className="input-field flex-1"
          >
            <option value="">-- Seleccionar colección --</option>
            {collections.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
          
          {selectedCollection && (
            <button
              onClick={startAdd}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>

      {/* Formulario para agregar/editar */}
      {(showAddForm || editingDoc) && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              {editingDoc ? `Editar documento: ${editingDoc.id}` : 'Agregar nuevo documento'}
            </h3>
            <button
              onClick={cancelEdit}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Datos JSON
              </label>
              <textarea
                value={formData}
                onChange={(e) => setFormData(e.target.value)}
                rows={12}
                className="input-field font-mono text-sm"
                placeholder="Ingresa los datos en formato JSON..."
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={editingDoc ? handleUpdateDocument : handleAddDocument}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? 'Procesando...' : (editingDoc ? 'Actualizar' : 'Agregar')}
              </button>
              <button
                onClick={cancelEdit}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visualizador de documento */}
      {viewingDoc && (
        <div className="bg-white rounded-lg border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Ver documento: {viewingDoc.id}
            </h3>
            <button
              onClick={() => setViewingDoc(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          
          <pre className="bg-gray-50 rounded p-4 text-sm overflow-auto max-h-96">
            {JSON.stringify(viewingDoc, null, 2)}
          </pre>
        </div>
      )}

      {/* Lista de documentos */}
      {selectedCollection && (
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              Documentos en {selectedCollection} ({documents.length})
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando documentos...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-6 text-center">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay documentos en esta colección</p>
            </div>
          ) : (
            <div className="divide-y">
              {documents.map((document) => (
                <div key={document.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <DocumentTextIcon className="h-4 w-4 text-gray-400" />
                        <span className="font-mono text-sm font-medium">{document.id}</span>
                      </div>
                      
                      {/* Mostrar algunos campos clave */}
                      <div className="text-sm text-gray-600 space-y-1">
                        {Object.entries(document)
                          .filter(([key]) => key !== 'id')
                          .slice(0, 3)
                          .map(([key, value]) => (
                            <div key={key} className="flex">
                              <span className="font-medium w-24">{key}:</span>
                              <span className="truncate">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => viewDocument(document)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Ver"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => startEdit(document)}
                        className="p-1 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(document.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
