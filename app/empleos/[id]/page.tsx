'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ClientLayout from '@/components/layout/ClientLayout'
import MaintenancePage from '@/components/ui/MaintenancePage'
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

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

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string
  
  const [job, setJob] = useState<JobPosting | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
          description: 'Únete a nuestro equipo como Vendedor de Mostrador y forma parte de una empresa líder en el sector ferretero. Buscamos una persona entusiasta, con excelente atención al cliente y conocimientos en productos de construcción y ferretería. Ofrecemos un ambiente de trabajo dinámico, oportunidades de crecimiento y un equipo de trabajo comprometido.',
          requirements: `• Experiencia mínima de 1 año en ventas (preferiblemente en ferretería o construcción)
• Conocimientos básicos de materiales de construcción
• Excelente atención al cliente y habilidades de comunicación
• Capacidad para trabajar en equipo
• Responsabilidad y puntualidad
• Manejo básico de sistemas de punto de venta
• Disponibilidad de horario`,
          responsibilities: `• Atender a clientes en mostrador y brindar asesoría técnica
• Procesar ventas y manejar caja registradora
• Mantener el orden y limpieza del área de trabajo
• Realizar inventarios y control de mercancía
• Apoyar en la recepción y acomodo de productos
• Seguir procedimientos de seguridad y calidad
• Colaborar con el equipo para alcanzar metas de venta`,
          salaryMin: '8000',
          salaryMax: '12000',
          type: 'tiempo_completo',
          experience: '1-2 años en ventas',
          education: 'Bachillerato terminado',
          skills: ['Atención al cliente', 'Conocimientos de construcción', 'Manejo de caja', 'Trabajo en equipo', 'Comunicación efectiva'],
          benefits: `• Sueldo base competitivo + comisiones por ventas
• Prestaciones de ley (IMSS, INFONAVIT, vacaciones, aguinaldo)
• Capacitación continua en productos y técnicas de venta
• Oportunidades de crecimiento dentro de la empresa
• Ambiente de trabajo positivo y colaborativo
• Descuentos en productos de la empresa
• Bonos por cumplimiento de metas`,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'activa'
        }
        
        setJob(mockJob)
      } catch (error) {
        console.error('Error loading job:', error)
        setError('Error al cargar la información de la vacante')
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      loadJob()
    }
  }, [jobId])

  if (loading) {
    return (
      <ClientLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la vacante...</p>
          </div>
        </div>
      </ClientLayout>
    )
  }

  if (error || !job) {
    return (
      <ClientLayout>
        <MaintenancePage
          title="Vacante No Encontrada"
          message={error || "La vacante que buscas no existe o ya no está disponible."}
          showBackButton={true}
          contactInfo={false}
        />
      </ClientLayout>
    )
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tiempo_completo':
        return 'Tiempo Completo'
      case 'medio_tiempo':
        return 'Medio Tiempo'
      case 'temporal':
        return 'Temporal'
      default:
        return type
    }
  }

  const getSalaryRange = () => {
    if (job.salaryMin && job.salaryMax) {
      return `$${parseInt(job.salaryMin).toLocaleString()} - $${parseInt(job.salaryMax).toLocaleString()}`
    }
    return 'Salario competitivo'
  }

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/empleos"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Volver a Empleos
            </Link>
          </div>

          {/* Header de la vacante */}
          <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <BriefcaseIcon className="h-8 w-8 text-primary-600" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-lg text-gray-600">{job.branchName}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                    {job.department}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {job.branchName}
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                    {getSalaryRange()}
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    {getTypeLabel(job.type)}
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    Publicado {format(job.createdAt, 'dd MMM yyyy', { locale: es })}
                  </div>
                </div>
              </div>
              
              <div className="ml-6">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  job.status === 'activa' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {job.status === 'activa' ? 'Vacante Activa' : 'No Disponible'}
                </span>
              </div>
            </div>

            {/* Call to Action */}
            {job.status === 'activa' && (
              <div className="border-t border-gray-200 pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={`/empleos/${job.id}/aplicar`}
                    className="btn-primary inline-flex items-center justify-center px-8 py-3 text-lg font-medium"
                  >
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    Aplicar Ahora
                  </Link>
                  <Link
                    href="/contacto"
                    className="btn-secondary inline-flex items-center justify-center px-8 py-3 text-lg font-medium"
                  >
                    Hacer Pregunta
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Contenido principal */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Descripción */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción del Puesto</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.description}
                </p>
              </div>

              {/* Responsabilidades */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Responsabilidades Principales</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.responsibilities}
                </div>
              </div>

              {/* Requisitos */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requisitos</h2>
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </div>
              </div>

              {/* Beneficios */}
              {job.benefits && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Beneficios</h2>
                  <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {job.benefits}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Información rápida */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Rápida</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Salario</p>
                      <p className="font-medium">{getSalaryRange()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-600">Tipo de Empleo</p>
                      <p className="font-medium">{getTypeLabel(job.type)}</p>
                    </div>
                  </div>
                  
                  {job.experience && (
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Experiencia</p>
                        <p className="font-medium">{job.experience}</p>
                      </div>
                    </div>
                  )}
                  
                  {job.education && (
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm text-gray-600">Educación</p>
                        <p className="font-medium">{job.education}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Habilidades requeridas */}
              {job.skills && job.skills.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Habilidades Requeridas</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                      >
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Información de contacto */}
              <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
                <h3 className="text-lg font-semibold text-primary-900 mb-4">¿Tienes Preguntas?</h3>
                <p className="text-primary-800 text-sm mb-4">
                  Si tienes dudas sobre esta vacante, no dudes en contactarnos.
                </p>
                <Link
                  href="/empleos/contactar-rrhh"
                  className="btn-primary w-full text-center"
                >
                  Contactar RRHH
                </Link>
              </div>

              {/* Otras vacantes */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Otras Oportunidades</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Explora más vacantes disponibles en nuestras sucursales.
                </p>
                <div className="flex justify-center">
                  <Link
                    href="/empleos"
                    className="btn-secondary inline-flex items-center justify-center px-6 py-3 text-center"
                  >
                    Ver Todas las Vacantes
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action final */}
          {job.status === 'activa' && (
            <div className="mt-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                ¿Listo para Unirte a Nuestro Equipo?
              </h2>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                No pierdas esta oportunidad de formar parte de una empresa líder en el sector. 
                Aplica ahora y comienza tu carrera profesional con nosotros.
              </p>
              <Link
                href={`/empleos/${job.id}/aplicar`}
                className="bg-white text-primary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold inline-flex items-center"
              >
                <BriefcaseIcon className="h-5 w-5 mr-2" />
                Aplicar a Esta Vacante
              </Link>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  )
}