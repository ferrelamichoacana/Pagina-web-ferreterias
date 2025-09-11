'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

// Tipos simplificados para evitar conflictos
interface User {
  uid: string
  email: string | null
  displayName: string | null
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SimpleAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Simulación temporal para desarrollo
  useEffect(() => {
    // Simular carga inicial
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('Login attempt:', email)
      
      // Simulación de diferentes roles según el email
      let role = 'client'
      let displayName = 'Usuario'
      
      if (email.includes('admin')) {
        role = 'admin'
        displayName = 'Administrador'
      } else if (email.includes('vendedor')) {
        role = 'vendedor'
        displayName = 'Vendedor'
      } else if (email.includes('gerente')) {
        role = 'gerente'
        displayName = 'Gerente'
      } else if (email.includes('rrhh')) {
        role = 'rrhh'
        displayName = 'RRHH'
      } else if (email.includes('it')) {
        role = 'it'
        displayName = 'IT'
      }
      
      setUser({
        uid: `temp-${Date.now()}`,
        email,
        displayName,
        role
      })
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    try {
      console.log('Register attempt:', email, displayName)
      setUser({
        uid: `temp-${Date.now()}`,
        email,
        displayName,
        role: 'client'
      })
      
      return { success: true }
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = async () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout
    }}>
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