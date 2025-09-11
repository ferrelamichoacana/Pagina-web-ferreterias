import React from 'react'
import ClientLayout from '@/components/layout/ClientLayout'
import JobListings from '@/components/jobs/JobListings'

export default function JobsPage() {
  return (
    <ClientLayout>
      <JobListings />
    </ClientLayout>
  )
}

export const metadata = {
  title: 'Empleos - Ferretería La Michoacana',
  description: 'Únete a nuestro equipo. Oportunidades laborales en todas nuestras sucursales',
}