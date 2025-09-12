'use client'

import { useState, useCallback } from 'react'
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot, orderBy, updateDoc } from 'firebase/firestore'
import { getFirestore } from '@/lib/firebase/utils'

export interface FileRecord {
  id: string
  name: string
  size: number
  type: string
  url: string
  cloudinaryId: string
  uploadedAt: Date
  uploadedBy: string
  category: 'image' | 'document' | 'other'
  
  // Metadatos opcionales
  relatedTo?: string // ID del documento relacionado
  relatedType?: 'contact' | 'job_application' | 'quotation' | 'ticket' | 'user_profile'
  description?: string
  tags?: string[]
  isPublic?: boolean
}

interface UseFileManagerOptions {
  userId?: string
  relatedTo?: string
  relatedType?: string
  autoSync?: boolean
}

export function useFileManager({
  userId,
  relatedTo,
  relatedType,
  autoSync = true
}: UseFileManagerOptions = {}) {
  const [files, setFiles] = useState<FileRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Función para guardar archivo en Firestore
  const saveFileRecord = useCallback(async (fileData: Omit<FileRecord, 'id'>) => {
    try {
      const db = getFirestore()
      const docRef = await addDoc(collection(db, 'files'), {
        ...fileData,
        uploadedAt: new Date(),
        uploadedBy: userId || 'anonymous'
      })
      
      const newFile: FileRecord = {
        ...fileData,
        id: docRef.id,
        uploadedAt: new Date(),
        uploadedBy: userId || 'anonymous'
      }
      
      if (autoSync) {
        setFiles(prev => [...prev, newFile])
      }
      
      return newFile
    } catch (err) {
      console.error('Error saving file record:', err)
      throw new Error('Error al guardar el registro del archivo')
    }
  }, [userId, autoSync])

  // Función para eliminar archivo
  const deleteFile = useCallback(async (fileId: string, cloudinaryId: string) => {
    try {
      setLoading(true)
      
      // Eliminar de Cloudinary
      try {
        await fetch('/api/files/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cloudinaryId })
        })
      } catch (cloudinaryError) {
        console.warn('Error deleting from Cloudinary:', cloudinaryError)
        // Continuar con la eliminación de Firestore aunque falle Cloudinary
      }
      
      // Eliminar de Firestore
      const db = getFirestore()
      await deleteDoc(doc(db, 'files', fileId))
      
      if (autoSync) {
        setFiles(prev => prev.filter(file => file.id !== fileId))
      }
      
      return true
    } catch (err) {
      console.error('Error deleting file:', err)
      setError('Error al eliminar el archivo')
      return false
    } finally {
      setLoading(false)
    }
  }, [autoSync])

  // Función para obtener archivos con filtros
  const fetchFiles = useCallback(async (filters: {
    userId?: string
    relatedTo?: string
    relatedType?: string
    category?: string
  } = {}) => {
    try {
      setLoading(true)
      setError(null)
      
      const db = getFirestore()
      let q = query(collection(db, 'files'), orderBy('uploadedAt', 'desc'))
      
      // Aplicar filtros
      if (filters.userId) {
        q = query(q, where('uploadedBy', '==', filters.userId))
      }
      if (filters.relatedTo) {
        q = query(q, where('relatedTo', '==', filters.relatedTo))
      }
      if (filters.relatedType) {
        q = query(q, where('relatedType', '==', filters.relatedType))
      }
      if (filters.category) {
        q = query(q, where('category', '==', filters.category))
      }
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const filesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          uploadedAt: doc.data().uploadedAt?.toDate() || new Date()
        })) as FileRecord[]
        
        setFiles(filesData)
        setLoading(false)
      }, (err) => {
        console.error('Error fetching files:', err)
        setError('Error al cargar los archivos')
        setLoading(false)
      })
      
      return unsubscribe
    } catch (err) {
      console.error('Error setting up file listener:', err)
      setError('Error al configurar la sincronización de archivos')
      setLoading(false)
    }
  }, [])

  // Función para subir múltiples archivos
  const uploadFiles = useCallback(async (
    selectedFiles: File[],
    metadata: {
      relatedTo?: string
      relatedType?: string
      description?: string
      tags?: string[]
      isPublic?: boolean
    } = {}
  ) => {
    try {
      setLoading(true)
      setError(null)
      
      const uploadPromises = selectedFiles.map(async (file) => {
        // Subir a Cloudinary
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'ferreteria_uploads')
        formData.append('folder', metadata.relatedType || 'general')
        
        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
          {
            method: 'POST',
            body: formData
          }
        )
        
        if (!cloudinaryResponse.ok) {
          throw new Error(`Error al subir ${file.name}`)
        }
        
        const cloudinaryData = await cloudinaryResponse.json()
        
        // Determinar categoría
        const getCategory = (type: string): 'image' | 'document' | 'other' => {
          if (type.startsWith('image/')) return 'image'
          if (type.includes('pdf') || type.includes('doc') || type.includes('text')) return 'document'
          return 'other'
        }
        
        // Guardar en Firestore
        const fileRecord = await saveFileRecord({
          name: file.name,
          size: file.size,
          type: file.type,
          url: cloudinaryData.secure_url,
          cloudinaryId: cloudinaryData.public_id,
          category: getCategory(file.type),
          uploadedAt: new Date(),
          uploadedBy: userId || 'anonymous',
          ...metadata,
          relatedType: metadata.relatedType as "contact" | "job_application" | "quotation" | "ticket" | "user_profile" | undefined
        })
        
        return fileRecord
      })
      
      const uploadedFiles = await Promise.all(uploadPromises)
      return uploadedFiles
    } catch (err) {
      console.error('Error uploading files:', err)
      setError(err instanceof Error ? err.message : 'Error al subir archivos')
      throw err
    } finally {
      setLoading(false)
    }
  }, [userId, saveFileRecord])

  // Función para actualizar metadatos de archivo
  const updateFileMetadata = useCallback(async (
    fileId: string,
    updates: Partial<Pick<FileRecord, 'description' | 'tags' | 'isPublic'>>
  ) => {
    try {
      const db = getFirestore()
      const fileRef = doc(db, 'files', fileId)
      await updateDoc(fileRef, updates)
      
      if (autoSync) {
        setFiles(prev => prev.map(file => 
          file.id === fileId ? { ...file, ...updates } : file
        ))
      }
      
      return true
    } catch (err) {
      console.error('Error updating file metadata:', err)
      setError('Error al actualizar los metadatos del archivo')
      return false
    }
  }, [autoSync])

  // Función para obtener estadísticas de archivos
  const getFileStats = useCallback(() => {
    const totalFiles = files.length
    const totalSize = files.reduce((sum, file) => sum + file.size, 0)
    const byCategory = files.reduce((acc, file) => {
      acc[file.category] = (acc[file.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalFiles,
      totalSize,
      byCategory,
      averageSize: totalFiles > 0 ? totalSize / totalFiles : 0
    }
  }, [files])

  return {
    // Estado
    files,
    loading,
    error,
    
    // Acciones
    uploadFiles,
    deleteFile,
    fetchFiles,
    saveFileRecord,
    updateFileMetadata,
    
    // Utilidades
    getFileStats,
    
    // Setters
    setError,
    setFiles
  }
}