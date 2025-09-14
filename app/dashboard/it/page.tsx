import React from 'react'
import MaintenancePage from '@/components/ui/MaintenancePage'

export default function ITDashboardPage() {
  return (
    <MaintenancePage
      title="Panel de Soporte IT"
      message="El sistema de gestión de tickets IT está siendo desarrollado. Incluirá gestión de incidencias, asignación de técnicos y seguimiento de resoluciones."
      estimatedTime="Sistema de tickets en desarrollo"
      showBackButton={true}
      backButtonHref="/dashboard"
      backButtonLabel="Regresar al Dashboard"
    />
  )
}

export const metadata = {
  title: 'Panel IT - Ferretería La Michoacana',
  description: 'Sistema de gestión de soporte técnico y tickets',
}