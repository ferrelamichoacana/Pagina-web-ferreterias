import React from 'react'
import { Metadata } from 'next'
import HRDashboard from '@/components/dashboard/HRDashboard'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Panel de RRHH - Ferretería La Michoacana',
  description: 'Sistema ATS, gestión de vacantes y personal',
}

export default function HRDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['rrhh', 'admin']}>
      <HRDashboard />
    </ProtectedRoute>
  )
}