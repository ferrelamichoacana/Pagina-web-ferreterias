import React from 'react'
import { Metadata } from 'next'
import VendorDashboard from '@/components/dashboard/VendorDashboard'

export const metadata: Metadata = {
  title: 'Panel de Vendedor - Ferretería La Michoacana',
  description: 'Gestiona tus solicitudes asignadas y mantén contacto con tus clientes',
}

export default function VendorDashboardPage() {
  return <VendorDashboard />
}