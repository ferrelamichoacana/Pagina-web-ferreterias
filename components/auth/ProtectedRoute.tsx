'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/auth/login' 
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // No hay usuario, redirigir al login
        router.push(redirectTo)
        return
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        // Usuario no tiene permisos, redirigir al dashboard principal
        router.push('/dashboard')
        return
      }
    }
  }, [user, loading, router, allowedRoles, redirectTo])

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  // No mostrar nada si no hay usuario (se está redirigiendo)
  if (!user) {
    return null
  }

  // Verificar permisos de rol
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null
  }

  // Usuario autenticado y con permisos, mostrar contenido
  return <>{children}</>
}