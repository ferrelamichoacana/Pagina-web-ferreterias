/**
 * Utilidades para garantizar que Firebase esté correctamente configurado
 * Este archivo resuelve los problemas de tipos null en las operaciones de Firestore
 */

import { Firestore } from 'firebase/firestore'
import { Auth } from 'firebase/auth'
import { db, auth, isFirebaseConfigured } from '../firebase'

/**
 * Obtiene la instancia de Firestore garantizando que esté configurada
 * @throws Error si Firebase no está configurado
 */
export function getFirestore(): Firestore {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase no está configurado. Verifica las variables de entorno.')
  }
  return db
}

/**
 * Obtiene la instancia de Auth garantizando que esté configurada
 * @throws Error si Firebase no está configurado
 */
export function getAuth(): Auth {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase no está configurado. Verifica las variables de entorno.')
  }
  return auth
}

/**
 * Verifica si Firebase está disponible sin lanzar errores
 */
export function checkFirebaseAvailability(): { 
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
