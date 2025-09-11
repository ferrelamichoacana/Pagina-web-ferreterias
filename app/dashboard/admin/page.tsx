import React from 'react'
import AdminDashboard from '@/components/admin/AdminDashboard'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </ProtectedRoute>
  )
}

export const metadata = {
  title: 'Panel de Administración - Ferretería La Michoacana',
  description: 'Panel de control para administradores del sistema',
}