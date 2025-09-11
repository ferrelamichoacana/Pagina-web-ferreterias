'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ClientLayout from '@/components/layout/ClientLayout'
import JobApplicationForm from '@/components/jobs/JobApplicationForm'
import MaintenancePage from '@/components/ui/MaintenancePage'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

interface JobPosting {
  id: string
  title: string
  department: string
  branchId: string
  branchName: string
  description: string
  requirements: string
  responsibilities: string
  salaryMin?: string
  salaryMax?: string
  type: 'tiempo_completo' | 'medio_tiempo' | 'temporal'
  experience?: string
  education?: string
  skills: string[]
  benefits?: string
  createdAt: Date
  status: 'activa' | 'pausada' | 'cerrada'
}

export default function JobApplicationPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string
  
  const [job, setJob] = useState<JobPosting | null>(null)
  const [loading, setLoading] = useState(true)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // Cargar información de la vacante
  useEffect(() => {
    const loadJob = async () => {
      try {
        // Simulación de datos - en producción usar Firebase
        const mockJob: JobPosting = {
          id: jobId,
          title: 'Vendedor de Mostrador',
          department: 'Ventas',
          branchId: 'morelia-centro',
          branchName: 'Morelia Centro',
          description: 'Buscamos un vendedor entusiasta para atender a nuestros clientes en mostrador, brindar asesoría técnica sobre productos de ferretería y construcción.',
          requirements: 'Experiencia mínima de 1 año en ventas, conocimientos básicos de construcción, excelente atención al cliente.',
          responsibilities: 'Atender clientes en mostrador, asesorar sobre productos, procesar ventas, mantener orden en área de trabajo.',
          salaryMin: '8000',
          salaryMax: '12000',
          type: 'tiempo_completo',
          experience: '1-2 años en ventas',
          education: 'Bachillerato terminado',
          skills: ['Atención al cliente', 'Conocimientos de construcción', 'Manejo de caja'],
          benefits: 'Prestaciones de ley, comisiones por ventas, capacitación continua',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'activa'
        }
        
        setJob(mockJob)
      } catch (error) {
        console.error('Error loading job:', error)
        setSubmissionError('Error al cargar la información de la vacante')
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      loadJob()
    }
  }, [jobId])

  const handleApplicationSubmit = async (applicationData: any) => {
    try {
      const response = await fetch('/api/job-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData),
      })

      const result = await response.json()

      if (result.success) {
        setApplicationSubmitted(true)
      } else {
        setSubmissionError(result.error || 'Error al enviar la aplicación')
      }
      
    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmissionError('Error al enviar la aplicación. Por favor, inténtalo de nuevo.')
    }
  }

  const handleCancel = () => {
    router.back()
  }

  if (loading) {
    return (
      <ClientLayout showChat={false}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la vacante...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (submissionError && !job) {
    return (
      <ClientLayout showChat={false}>
        <MaintenancePage
          title="Error al Cargar Vacante"
          message={submissionError}
          showBackButton={true}
          contactInfo={true}
        />
      </ClientLayout>
    )
  }

  if (!job) {
    return (
      <ClientLayout showChat={false}>
        <MaintenancePage
          title="Vacante No Encontrada"
          message="La vacante que buscas no existe o ya no está disponible."
          showBackButton={true}
          contactInfo={false}
        />
      </ClientLayout>
    )
  }

  if (job.status !== 'activa') {
    return (
      <ClientLayout showChat={false}>
        <MaintenancePage
          title="Vacante No Disponible"
          message="Esta vacante ya no está aceptando aplicaciones."
          showBackButton={true}
          contactInfo={false}
        />
      </ClientLayout>
    )
  }

  if (applicationSubmitted) {
    return (
      <ClientLayout showChat={false}>
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                ¡Aplicación Enviada Exitosamente!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Tu aplicación para <strong>{job.title}</strong> en <strong>{job.branchName}</strong> 
                ha sido recibida correctamente. Nuestro equipo de Recursos Humanos la revisará 
                y te contactaremos pronto.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-900 mb-2">Próximos Pasos:</h3>
                <ul className="text-sm text-blue-800 text-left space-y-1">
                  <li>• Revisaremos tu aplicación en las próximas 48 horas</li>
                  <li>• Te contactaremos por email o teléfono si tu perfil es seleccionado</li>
                  <li>• Puedes seguir aplicando a otras vacantes disponibles</li>
                  <li>• Revisa tu email regularmente para actualizaciones</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push('/empleos')}
                  className="btn-primary"
                >
                  Ver Más Vacantes
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="btn-secondary"
                >
                  Ir al Inicio
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mt-6">
                Si tienes preguntas sobre tu aplicación, puedes contactarnos a través de nuestro 
                formulario de contacto o llamando directamente a la sucursal.
              </p>
            </div>
          </div>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout showChat={false}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {submissionError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-center">{submissionError}</p>
            </div>
          )}
          
          <JobApplicationForm
            jobId={job.id}
            jobTitle={job.title}
            branchName={job.branchName}
            onSubmit={handleApplicationSubmit}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </ClientLayout>
  )
}