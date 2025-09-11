import React from 'react'
import { Metadata } from 'next'
import JobApplicationForm from '@/components/jobs/JobApplicationForm'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Forzar renderizado dinámico para evitar problemas con event handlers
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aplicación Espontánea - Ferretería La Michoacana',
  description: 'Envía tu currículum para futuras oportunidades laborales',
}

export default function SpontaneousApplicationPage() {
  // Datos para aplicación espontánea
  const spontaneousJobData = {
    id: 'espontanea',
    title: 'Aplicación Espontánea',
    department: 'Recursos Humanos',
    branchId: 'general',
    branchName: 'Todas las sucursales',
    description: 'Envía tu currículum y nos pondremos en contacto contigo cuando tengamos una vacante que se ajuste a tu perfil.',
    requirements: [
      'Disponibilidad para trabajar',
      'Actitud positiva y ganas de aprender',
      'Compromiso con la excelencia en el servicio'
    ],
    benefits: [
      'Oportunidades de crecimiento',
      'Ambiente de trabajo familiar',
      'Capacitación continua'
    ],
    type: 'tiempo_completo' as const,
    salaryMin: 0,
    salaryMax: 0,
    skills: [],
    status: 'activa' as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Aplicación Espontánea
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ¿No encontraste una vacante que se ajuste a tu perfil? No te preocupes. 
              Envíanos tu currículum y nos pondremos en contacto contigo cuando tengamos 
              una oportunidad que coincida con tus habilidades y experiencia.
            </p>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-blue-900 mb-3">
              ¿Por qué aplicar de forma espontánea?
            </h2>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Serás el primero en ser considerado para nuevas vacantes
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Mantendremos tu perfil en nuestra base de datos de talentos
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Te contactaremos cuando surjan oportunidades que coincidan contigo
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                Demuestras iniciativa y interés genuino en trabajar con nosotros
              </li>
            </ul>
          </div>

          {/* Formulario */}
          <JobApplicationForm 
            jobId={spontaneousJobData.id}
            jobTitle={spontaneousJobData.title}
            branchName={spontaneousJobData.branchName}
            onSubmit={(data) => console.log('Submitting spontaneous application:', data)}
            onCancel={() => window.history.back()}
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}