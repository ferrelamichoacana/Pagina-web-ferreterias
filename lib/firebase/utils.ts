/**
 * Utilidades para garantizar que Firebase esté correctamente configurado
 * Este archivo resuelve los problemas de tipos null en las operaciones de Firestore
 */

import { Firestore } from 'firebase/firestore'
import { Auth } from 'firebase/auth'

// Importar tanto client como server side Firebase
let db: Firestore | null = null
let auth: Auth | null = null
let isFirebaseConfigured: () => boolean

// Detectar si estamos en el servidor o cliente y usar la configuración apropiada
if (typeof window === 'undefined') {
  // Servidor - usar configuración de servidor
  try {
    const firebaseServer = require('../firebase-server')
    db = firebaseServer.db
    auth = firebaseServer.auth
    isFirebaseConfigured = firebaseServer.isFirebaseConfigured
  } catch (error) {
    console.error('Error importing server Firebase:', error)
    isFirebaseConfigured = () => false
  }
} else {
  // Cliente - usar configuración de cliente
  try {
    const firebaseClient = require('../firebase')
    db = firebaseClient.db
    auth = firebaseClient.auth
    isFirebaseConfigured = firebaseClient.isFirebaseConfigured
  } catch (error) {
    console.error('Error importing client Firebase:', error)
    isFirebaseConfigured = () => false
  }
}

/**
 * Obtiene la instancia de Firestore garantizando que esté configurada
 * @throws Error si Firebase no está configurado
 */
export function getFirebaseFirestore(): Firestore {
  // En server-side, reinicializar dinámicamente si es necesario
  if (typeof window === 'undefined') {
    try {
      const firebaseServer = require('../firebase-server')
      const { db: serverDb } = firebaseServer.getFirebaseInstances()
      return serverDb
    } catch (error) {
      throw new Error('Firebase no está configurado en el servidor. Verifica las variables de entorno.')
    }
  }
  
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase no está configurado. Verifica las variables de entorno.')
  }
  return db
}

// Mantener backward compatibility
export const getFirestore = getFirebaseFirestore

/**
 * Obtiene la instancia de Auth garantizando que esté configurada
 * @throws Error si Firebase no está configurado
 */
export function getFirebaseAuth(): Auth {
  // En server-side, reinicializar dinámicamente si es necesario
  if (typeof window === 'undefined') {
    try {
      const firebaseServer = require('../firebase-server')
      const { auth: serverAuth } = firebaseServer.getFirebaseInstances()
      return serverAuth
    } catch (error) {
      throw new Error('Firebase no está configurado en el servidor. Verifica las variables de entorno.')
    }
  }
  
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase no está configurado. Verifica las variables de entorno.')
  }
  return auth
}

// Mantener backward compatibility
export const getAuth = getFirebaseAuth

/**
 * Verifica si Firebase está disponible sin lanzar errores
 */
export function checkFirebaseAvailability(): boolean {
  try {
    if (typeof window === 'undefined') {
      // Server-side check
      const firebaseServer = require('../firebase-server')
      return firebaseServer.isFirebaseConfigured()
    } else {
      // Client-side check
      return isFirebaseConfigured && isFirebaseConfigured()
    }
  } catch (error) {
    console.error('Error checking Firebase availability:', error)
    return false
  }
}

/**
 * Verifica si Firebase está disponible y retorna información detallada
 */
export function getFirebaseStatus(): { 
  available: boolean, 
  db: Firestore | null, 
  auth: Auth | null,
  error?: string 
} {
  try {
    return {
      available: isFirebaseConfigured(),
      db: db,
      auth: auth
    }
  } catch (error) {
    return {
      available: false,
      db: null,
      auth: null,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

/**
 * Hook para manejar errores de Firebase de forma consistente
 */
export function handleFirebaseError(error: any, context: string = 'Firebase operation'): string {
  console.error(`❌ ${context}:`, error)
  
  if (error?.code) {
    switch (error.code) {
      case 'permission-denied':
        return 'No tienes permisos para realizar esta operación'
      case 'unavailable':
        return 'Servicio temporalmente no disponible. Intenta más tarde.'
      case 'not-found':
        return 'El documento solicitado no existe'
      case 'already-exists':
        return 'El documento ya existe'
      default:
        return `Error de Firebase: ${error.message || error.code}`
    }
  }
  
  if (error?.message?.includes('Firebase no está configurado')) {
    return 'Firebase no está configurado correctamente'
  }
  
  return error instanceof Error ? error.message : 'Error desconocido'
}
