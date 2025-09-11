'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import MaintenancePage from '@/components/ui/MaintenancePage'
import { 
  BriefcaseIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PlusIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface JobPosting {
  id: string
  title: string
  department: string
  branchId: string
  branchName: string
  status: 'activa' | 'pausada' | 'cerrada'
  applicationsCount: number
  createdAt: Date
  salary: string
  type: 'tiempo_completo' | 'medio_tiempo' | 'temporal'
}

interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  applicantName: string
  applicantEmail: string
  phone: string
  status: 'nueva' | 'revisada' | 'entrevista' | 'rechazada' | 'contratada'
  appliedAt: Date
  branchName: string
  experience: string
}

export default function HRDashboard() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'vacantes' | 'aplicaciones'>('vacantes')
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todas')

  // Cargar datos simulados (en producción usar Firebase)
  useEffect(() => {
    const loadData = async () => {
      // Simulación de vacantes
      const mockJobPostings: JobPosting[] = [
        {
          id: '1',
          title: 'Vendedor de Mostrador',
          department: 'Ventas',
          branchId: 'morelia-centro',
          branchName: 'Morelia Centro',
          status: 'activa',
          applicationsCount: 12,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          salary: '$8,000 - $12,000',
          type: 'tiempo_completo'
        },
        {
          id: '2',
          title: 'Auxiliar de Almacén',
          department: 'Logística',
          branchId: 'uruapan',
          branchName: 'Uruapan',
          status: 'activa',
          applicationsCount: 8,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          salary: '$7,000 - $9,000',
          type: 'tiempo_completo'
        },
        {
          id: '3',
          title: 'Cajero/a',
          department: 'Ventas',
          branchId: 'zamora',
          branchName: 'Zamora',
          status: 'pausada',
          applicationsCount: 15,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          salary: '$6,500 - $8,500',
          type: 'medio_tiempo'
        }
      ]

      // Simulación de aplicaciones
      const mockApplications: JobApplication[] = [
        {
          id: '1',
          jobId: '1',
          jobTitle: 'Vendedor de Mostrador',
          applicantName: 'María González Pérez',
          applicantEmail: 'maria.gonzalez@email.com',
          phone: '(443) 123-4567',
          status: 'nueva',
          appliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          branchName: 'Morelia Centro',
          experience: '2 años en ventas retail'
        },
        {
          id: '2',
          jobId: '1',
          jobTitle: 'Vendedor de Mostrador',
          applicantName: 'Carlos Ramírez López',
          applicantEmail: 'carlos.ramirez@email.com',
          phone: '(443) 987-6543',
          status: 'revisada',
          appliedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          branchName: 'Morelia Centro',
          experience: '5 años en ferreterías'
        },
        {
          id: '3',
          jobId: '2',
          jobTitle: 'Auxiliar de Almacén',
          applicantName: 'Ana Martínez Ruiz',
          applicantEmail: 'ana.martinez@email.com',
          phone: '(452) 555-0123',
          status: 'entrevista',
          appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          branchName: 'Uruapan',
          experience: '1 año en almacenes'
        }
      ]

      setJobPostings(mockJobPostings)
      setApplications(mockApplications)
      setLoading(false)
    }

    loadData()
  }, [])

  // Verificar autenticación y rol
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user || (user.role !== 'rrhh' && user.role !== 'admin')) {
    return (
      <MaintenancePage
        title="Acceso Restringido"
        message="Esta sección está disponible solo para el personal de Recursos Humanos."
        showBackButton={true}
        contactInfo={false}
      />
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nueva':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      case 'revisada':
        return <EyeIcon className="h-5 w-5 text-yellow-500" />
      case 'entrevista':
        return <UserGroupIcon className="h-5 w-5 text-orange-500" />
      case 'contratada':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'rechazada':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nueva':
        return 'bg-blue-100 text-blue-800'
      case 'revisada':
        return 'bg-yellow-100 text-yellow-800'
      case 'entrevista':
        return 'bg-orange-100 text-orange-800'
      case 'contratada':
        return 'bg-green-100 text-green-800'
      case 'rechazada':
        return 'bg-red-100 text-red-800'
      case 'activa':
        return 'bg-green-100 text-green-800'
      case 'pausada':
        return 'bg-yellow-100 text-yellow-800'
      case 'cerrada':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicantEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todas' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    totalVacantes: jobPostings.length,
    vacantesActivas: jobPostings.filter(j => j.status === 'activa').length,
    totalAplicaciones: applications.length,
    aplicacionesNuevas: applications.filter(a => a.status === 'nueva').length,
    entrevistas: applications.filter(a => a.status === 'entrevista').length,
    contrataciones: applications.filter(a => a.status === 'contratada').length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header del dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Panel de Recursos Humanos
          </h1>
          <p className="text-gray-600 mt-2">
            Sistema de gestión de vacantes y candidatos (ATS)
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vacantes Totales</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalVacantes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Activas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.vacantesActivas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aplicaciones</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAplicaciones}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Nuevas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.aplicacionesNuevas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entrevistas</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.entrevistas}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contratados</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.contrataciones}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('vacantes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vacantes'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BriefcaseIcon className="h-5 w-5 inline mr-2" />
                Gestión de Vacantes
              </button>
              <button
                onClick={() => setActiveTab('aplicaciones')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'aplicaciones'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <UserGroupIcon className="h-5 w-5 inline mr-2" />
                Candidatos y Aplicaciones
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de tabs */}
        {activeTab === 'vacantes' ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Vacantes Publicadas</h2>
              <button className="btn-primary inline-flex items-center">
                <PlusIcon className="h-5 w-5 mr-2" />
                Nueva Vacante
              </button>
            </div>
            
            {loading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {jobPostings.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <BriefcaseIcon className="h-5 w-5 text-primary-600" />
                          <h3 className="text-lg font-medium text-gray-900">
                            {job.title}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span>🏢 {job.branchName}</span>
                          <span>📋 {job.department}</span>
                          <span>💰 {job.salary}</span>
                          <span>⏰ {job.type.replace('_', ' ')}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {format(job.createdAt, 'dd MMM yyyy', { locale: es })}</span>
                          <span>👥 {job.applicationsCount} aplicaciones</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button className="btn-secondary text-sm">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Ver Detalles
                        </button>
                        <button className="btn-primary text-sm">
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <h2 className="text-lg font-semibold text-gray-900">Aplicaciones de Candidatos</h2>
                
                <div className="flex space-x-4">
                  {/* Buscador */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar candidatos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Filtro por estado */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="todas">Todos los estados</option>
                    <option value="nueva">Nuevas</option>
                    <option value="revisada">Revisadas</option>
                    <option value="entrevista">En Entrevista</option>
                    <option value="contratada">Contratadas</option>
                    <option value="rechazada">Rechazadas</option>
                  </select>
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="p-6">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="p-12 text-center">
                <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron aplicaciones
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'todas' 
                    ? 'Intenta ajustar los filtros de búsqueda'
                    : 'Aún no hay aplicaciones de candidatos'
                  }
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(application.status)}
                          <h3 className="text-lg font-medium text-gray-900">
                            {application.applicantName}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {application.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-2">
                          Aplicó para: <span className="font-medium">{application.jobTitle}</span>
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                          <span>📧 {application.applicantEmail}</span>
                          <span>📞 {application.phone}</span>
                          <span>🏢 {application.branchName}</span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {format(application.appliedAt, 'dd MMM yyyy HH:mm', { locale: es })}</span>
                          <span>💼 {application.experience}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button className="btn-secondary text-sm">
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Ver CV
                        </button>
                        <button className="btn-primary text-sm">
                          Gestionar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}