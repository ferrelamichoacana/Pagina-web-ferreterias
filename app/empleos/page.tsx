import React from 'react'
import ClientLayout from '@/components/layout/ClientLayout'
import JobApplicationForm from '@/components/jobs/JobApplicationForm'

export default function JobsPage() {
  return (
    <ClientLayout>
      <JobApplicationForm />
    </ClientLayout>
  )
}

export const metadata = {
  title: 'Bolsa de Trabajo - Ferretería La Michoacana',
  description: 'Únete a nuestro equipo. Envíanos tu CV y forma parte de Ferretería La Michoacana',
}