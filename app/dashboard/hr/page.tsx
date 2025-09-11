import React from 'react'
import { Metadata } from 'next'
import HRDashboard from '@/components/dashboard/HRDashboard'

export const metadata: Metadata = {
  title: 'Panel de RRHH - Ferretería La Michoacana',
  description: 'Sistema de gestión de vacantes y candidatos (ATS)',
}

export default function HRDashboardPage() {
  return <HRDashboard />
}