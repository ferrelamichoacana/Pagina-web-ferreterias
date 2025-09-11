'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User, UserRole } from '@/types'

interface AuthContextType {
  user: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, displayName: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Función para obtener datos adicionales del usuario desde Firestore
  const fetchUserData = async (firebaseUser: FirebaseUser): Promise<User | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        return {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || userData.displayName,
          role: userData.role || 'cliente',
          branchId: userData.branchId,
          phone: userData.phone,
          companyName: userData.companyName,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date(),
        }
      } else {
        // Si no existe el documento del usuario, crearlo con datos básicos
        const newUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName || '',
          role: 'cliente' as UserRole,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        
        await setDoc(doc(db, 'users', firebaseUser.uid), {
          ...newUserData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
        
        return newUserData
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      return null
    }
  }

  // Función para refrescar datos del usuario
  const refreshUser = async () => {
    if (firebaseUser) {
      const userData = await fetchUserData(firebaseUser)
      setUser(userData)
    }
  }

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Los datos del usuario se actualizarán automáticamente por onAuthStateChanged
      return { success: true }
    } catch (error: any) {
      console.error('Error signing in:', error)
      
      let errorMessage = 'Por favor verifica tus datos e intenta de nuevo'
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Email o contraseña incorrectos. Verifica tus datos.'
          break
        case 'auth/invalid-email':
          errorMessage = 'Formato de email inválido'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Demasiados intentos fallidos. Intenta más tarde'
          break
        case 'auth/user-disabled':
          errorMessage = 'Esta cuenta ha sido deshabilitada'
          break
        default:
          errorMessage = 'Por favor verifica tus datos e intenta de nuevo'
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Función para registrar usuario
  const register = async (email: string, password: string, displayName: string, role: UserRole = 'cliente') => {
    try {
      setLoading(true)
      const result = await createUserWithEmailAndPassword(auth, email, password)
      
      // Actualizar el perfil con el nombre
      await updateProfile(result.user, { displayName })
      
      // Crear documento del usuario en Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName,
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      
      return { success: true }
    } catch (error: any) {
      console.error('Error registering user:', error)
      
      let errorMessage = 'Error al crear la cuenta'
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este email ya está registrado'
          break
        case 'auth/invalid-email':
          errorMessage = 'Email inválido'
          break
        case 'auth/weak-password':
          errorMessage = 'La contraseña debe tener al menos 6 caracteres'
          break
        default:
          errorMessage = error.message || 'Error desconocido'
      }
      
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', firebaseUser?.email)
      setFirebaseUser(firebaseUser)
      
      if (firebaseUser) {
        console.log('Firebase user found, fetching user data...')
        const userData = await fetchUserData(firebaseUser)
        console.log('User data fetched:', userData)
        setUser(userData)
      } else {
        console.log('No firebase user, clearing state')
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Función para cerrar sesión
  const logout = async () => {
    try {
      await signOut(auth)
      setUser(null)
      setFirebaseUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}