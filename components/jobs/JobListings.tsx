'use client'

import React, { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { useBranches } from '@/lib/hooks/useFirebaseData'
import { 
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'

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

export default function JobListings() {
  const { t } = useLanguage()
  const { branches, loading: branchesLoading } = useBranches()
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBranch, setSelectedBranch] = useState<string>('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')

  // Cargar vacantes activas (simulado - en producción usar Firebase)
  useEffect(() => {
    const loadJobs = async () => {
      // Simulación de datos
      const mockJobs: JobPosting[] = [
        {
          id: '1',
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
        },
        {
          id: '2',
          title: 'Auxiliar de Almacén',
          department: 'Logística',
          branchId: 'uruapan',
          branchName: 'Uruapan',
          description: 'Únete a nuestro equipo de almacén para el manejo de inventarios, recepción y despacho de mercancía.',
          requirements: 'Educación secundaria, capacidad física para cargar peso, responsabilidad y puntualidad.',
          responsibilities: 'Recibir mercancía, acomodar productos, preparar pedidos, mantener orden en almacén.',
          salaryMin: '7000',
          salaryMax: '9000',
          type: 'tiempo_completo',
          experience: 'No requerida',
          education: 'Secundaria terminada',
          skills: ['Organización', 'Trabajo en equipo', 'Manejo de inventarios'],
          benefits: 'Prestaciones de ley, uniformes, oportunidad de crecimiento',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'activa'
        },
        {
          id: '3',
          title: 'Cajero/a',
          department: 'Ventas',
          branchId: 'zamora',
          branchName: 'Zamora',
          description: 'Buscamos cajero/a para turno matutino, responsable del manejo de efectivo y atención al cliente.',
          requirements: 'Experiencia en manejo de dinero, honestidad, buena presentación.',
          responsibilities: 'Procesar pagos, manejar caja registradora, atender clientes, cuadrar caja.',
          salaryMin: '6500',
          salaryMax: '8500',
          type: 'medio_tiempo',
          experience: '6 meses en caja',
          education: 'Bachillerato en curso',
          skills: ['Manejo de dinero', 'Atención al cliente', 'Responsabilidad'],
          benefits: 'Prestaciones proporcionales, horario flexible',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'activa'
        }
      ]
      
      setJobs(mockJobs)
      setLoading(false)
    }

    loadJobs()
  }, [])

  // Filtrar trabajos
  const filteredJobs = jobs.filter(job => {
    const matchesBranch = !selectedBranch || job.branchId === selectedBranch
    const matchesDepartment = !selectedDepartment || job.department === selectedDepartment
    const matchesType = !selectedType || job.type === selectedType
    return matchesBranch && matchesDepartment && matchesType && job.status === 'activa'
  })

  const departments = Array.from(new Set(jobs.map(job => job.department)))
  const jobTypes = [
    { value: 'tiempo_completo', label: 'Tiempo Completo' },
    { value: 'medio_tiempo', label: 'Medio Tiempo' },
    { value: 'temporal', label: 'Temporal' }
  ]

  const getTypeLabel = (type: string) => {
    const typeObj = jobTypes.find(t => t.value === type)
    return typeObj ? typeObj.label : type
  }

  const getSalaryRange = (job: JobPosting) => {
    if (job.salaryMin && job.salaryMax) {
      return `$${parseInt(job.salaryMin).toLocaleString()} - $${parseInt(job.salaryMax).toLocaleString()}`
    }
    return 'Salario competitivo'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Oportunidades de Empleo
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Únete a nuestro equipo y construye tu futuro profesional con nosotros. 
          Ofrecemos un ambiente de trabajo positivo y oportunidades de crecimiento.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar Vacantes</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sucursal
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="input-field"
              disabled={branchesLoading}
            >
              <option value="">{branchesLoading ? 'Cargando sucursales...' : 'Todas las sucursales'}</option>
              {branches?.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.name} - {branch.city}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departamento
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input-field"
            >
              <option value="">Todos los departamentos</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Empleo
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="input-field"
            >
              <option value="">Todos los tipos</option>
              {jobTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lista de trabajos */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-12">
          <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay vacantes disponibles
          </h3>
          <p className="text-gray-600">
            {selectedBranch || selectedDepartment || selectedType
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Actualmente no tenemos vacantes abiertas, pero pronto habrá nuevas oportunidades'
            }
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <BriefcaseIcon className="h-6 w-6 text-primary-600" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.title}
                      </h3>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {getTypeLabel(job.type)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
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
                        {getSalaryRange(job)}
                      </div>
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {format(job.createdAt, 'dd MMM yyyy', { locale: es })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>
                
                {/* Habilidades */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 4).map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700">
                          +{job.skills.length - 4} más
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {job.experience && (
                      <span>Experiencia: {job.experience}</span>
                    )}
                  </div>
                  
                  <div className="flex space-x-3">
                    <Link
                      href={`/empleos/${job.id}`}
                      className="btn-secondary inline-flex items-center text-sm"
                    >
                      <EyeIcon className="h-4 w-4 mr-2" />
                      Ver Detalles
                    </Link>
                    <Link
                      href={`/empleos/${job.id}/aplicar`}
                      className="btn-primary inline-flex items-center text-sm"
                    >
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      Aplicar Ahora
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to action */}
      <div className="mt-12 text-center">
        <div className="bg-primary-50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            ¿No encontraste lo que buscas?
          </h3>
          <p className="text-gray-600 mb-6">
            Envíanos tu CV y te contactaremos cuando tengamos una vacante que se ajuste a tu perfil.
          </p>
          <Link
            href="/empleos/aplicacion-espontanea"
            className="btn-primary inline-flex items-center"
          >
            Enviar CV Espontáneo
          </Link>
        </div>
      </div>
    </div>
  )
}