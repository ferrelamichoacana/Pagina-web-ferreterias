'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { 
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  ComputerDesktopIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

interface ITTicket {
  id: string
  ticketNumber: string
  title: string
  description: string
  category: 'hardware' | 'software' | 'red' | 'sistema' | 'otro'
  priority: 'baja' | 'media' | 'alta' | 'critica'
  status: 'abierto' | 'en_proceso' | 'esperando_info' | 'resuelto' | 'cerrado'
  branchId: string
  branchName: string
  createdBy: string
  creatorName: string
  assignedTo?: string
  assignedToName?: string
  rustdeskCode?: string
  rustdeskPassword?: string
  availableSchedule?: string
  imageUrl?: string
  resolutionNotes?: string
  createdAt: Date
  updatedAt: Date
}

export default function TicketManager() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<ITTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<ITTicket | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [priorityFilter, setPriorityFilter] = useState<string>('todas')

  // Mock data para desarrollo
  const mockTickets: ITTicket[] = [
    {
      id: '1',
      ticketNumber: 'IT-2025-001',
      title: 'Computadora no enciende en caja 2',
      description: 'La computadora de la caja 2 no enciende desde esta mañana. Se escucha un pitido cuando se presiona el botón de encendido.',
      category: 'hardware',
      priority: 'alta',
      status: 'abierto',
      branchId: 'morelia-centro',
      branchName: 'Morelia Centro',
      createdBy: 'user123',
      creatorName: 'María González',
      rustdeskCode: '123456789',
      rustdeskPassword: 'temp123',
      availableSchedule: 'Lunes a Viernes 9:00-17:00',
      createdAt: new Date('2025-01-10T09:30:00'),
      updatedAt: new Date('2025-01-10T09:30:00')
    },
    {
      id: '2',
      ticketNumber: 'IT-2025-002',
      title: 'Sistema de inventario lento',
      description: 'El sistema de inventario está muy lento, tarda mucho en cargar los productos y hacer consultas.',
      category: 'software',
      priority: 'media',
      status: 'en_proceso',
      branchId: 'uruapan',
      branchName: 'Uruapan',
      createdBy: 'user456',
      creatorName: 'Carlos Ramírez',
      assignedTo: user?.uid,
      assignedToName: user?.displayName || 'Técnico IT',
      createdAt: new Date('2025-01-09T14:15:00'),
      updatedAt: new Date('2025-01-10T08:45:00')
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setTickets(mockTickets)
      setLoading(false)
    }, 1000)
  }, [])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critica':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'alta':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'abierto':
        return 'bg-blue-100 text-blue-800'
      case 'en_proceso':
        return 'bg-yellow-100 text-yellow-800'
      case 'esperando_info':
        return 'bg-purple-100 text-purple-800'
      case 'resuelto':
        return 'bg-green-100 text-green-800'
      case 'cerrado':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hardware':
        return ComputerDesktopIcon
      case 'software':
        return WrenchScrewdriverIcon
      default:
        return ExclamationTriangleIcon
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'todos' || ticket.status === statusFilter
    const matchesPriority = priorityFilter === 'todas' || ticket.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-600">Cargando tickets...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tickets de Soporte IT</h2>
          <p className="text-gray-600">Gestiona solicitudes de soporte técnico</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Nuevo Ticket</span>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Filtro por estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="todos">Todos los estados</option>
            <option value="abierto">Abierto</option>
            <option value="en_proceso">En Proceso</option>
            <option value="esperando_info">Esperando Info</option>
            <option value="resuelto">Resuelto</option>
            <option value="cerrado">Cerrado</option>
          </select>

          {/* Filtro por prioridad */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-field"
          >
            <option value="todas">Todas las prioridades</option>
            <option value="critica">Crítica</option>
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>

          {/* Estadísticas rápidas */}
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">
              Total: <span className="font-semibold">{filteredTickets.length}</span>
            </span>
            <span className="text-red-600">
              Críticos: <span className="font-semibold">{filteredTickets.filter(t => t.priority === 'critica').length}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lista de tickets */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => {
          const CategoryIcon = getCategoryIcon(ticket.category)
          
          return (
            <div
              key={ticket.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <CategoryIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{ticket.ticketNumber}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {ticket.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">
                    {ticket.description}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{ticket.creatorName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📍</span>
                      <span>{ticket.branchName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{ticket.createdAt.toLocaleDateString()}</span>
                    </div>
                    {ticket.assignedToName && (
                      <div className="flex items-center space-x-1">
                        <span>👤</span>
                        <span>Asignado a: {ticket.assignedToName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredTickets.length === 0 && (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No se encontraron tickets</p>
        </div>
      )}
    </div>
  )
}