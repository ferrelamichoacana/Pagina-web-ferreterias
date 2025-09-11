import React from 'react'
import { Metadata } from 'next'
import ManagerDashboard from '@/components/dashboard/ManagerDashboard'

export const metadata: Metadata = {
  title: 'Panel de Gerente - Ferretería La Michoacana',
  description: 'Gestiona las solicitudes de tu sucursal y asigna vendedores',
}

export default function ManagerDashboardPage() {
  return <ManagerDashboard />
}