import React from 'react'
import { Metadata } from 'next'
import ClientDashboard from '@/components/dashboard/ClientDashboard'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

export const metadata: Metadata = {
  title: 'Panel de Cliente - Ferretería La Michoacana',
  description: 'Gestiona tus solicitudes, cotizaciones y comunicación',
}

export default function ClientDashboardPage() {
  return (
    <ProtectedRoute>
      <ClientDashboard />
    </ProtectedRoute>
  )
}