// Tipos principales para la aplicación de Ferretería La Michoacana

export interface User {
  uid: string
  email: string
  displayName?: string
  role: UserRole
  branchId?: string // ID de sucursal para vendedores y gerentes
  phone?: string
  companyName?: string
  createdAt: Date
  updatedAt: Date
}

export type UserRole = 'cliente' | 'vendedor' | 'gerente' | 'rrhh' | 'it' | 'admin'

export interface Branch {
  id: string
  name: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  schedule: string
  coordinates?: {
    lat: number
    lng: number
  }
  managerId?: string
  isMain?: boolean
  services?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ContactRequest {
  id: string
  userId?: string // Si el usuario está registrado
  companyName: string
  contactName: string
  email: string
  phone: string
  branchId?: string
  location: string
  estimatedBudget?: string
  projectDescription: string
  subscribeNewsletter: boolean
  status: 'pendiente' | 'asignada' | 'en_proceso' | 'resuelta'
  assignedTo?: string // UID del vendedor asignado
  assignedBy?: string // UID del gerente que asignó
  createdAt: Date
  updatedAt: Date
}

export interface ChatMessage {
  id: string
  requestId: string
  senderId: string
  senderName: string
  senderRole: UserRole
  message: string
  timestamp: Date
  read: boolean
}

export interface JobPosting {
  id: string
  branchId: string
  branchName: string
  title: string
  description: string
  requirements: string
  salary?: string
  schedule: string
  benefits?: string
  status: 'activa' | 'cerrada'
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  branchId: string
  branchName: string
  applicantName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  educationLevel: 'primaria' | 'secundaria' | 'preparatoria' | 'tecnico' | 'licenciatura' | 'posgrado'
  experience: string
  desiredSalary?: number
  availability: string
  cvUrl?: string // URL del CV en Cloudinary
  status: 'nuevo' | 'contactado' | 'entrevista' | 'descartado' | 'contratado'
  notes?: string // Notas internas de RRHH
  createdAt: Date
  updatedAt: Date
}

export interface ITTicket {
  id: string
  branchId: string
  branchName: string
  createdBy: string
  creatorName: string
  category: 'hardware' | 'software' | 'red' | 'sistema' | 'otro'
  title: string
  description: string
  priority: 'baja' | 'media' | 'alta' | 'critica'
  status: 'abierto' | 'en_proceso' | 'esperando_info' | 'resuelto' | 'cerrado'
  assignedTo?: string
  assignedToName?: string
  rustdeskCode?: string
  rustdeskPassword?: string
  availableSchedule?: string
  imageUrl?: string // Captura de pantalla en Cloudinary
  resolutionNotes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Brand {
  id: string
  name: string
  logoUrl: string
  category: string
  description?: string
  website?: string
  active: boolean
}

export interface NewsItem {
  id: string
  title: string
  description: string
  type: 'noticia' | 'promocion'
  imageUrl?: string
  link?: string
  featured?: boolean
  date: Date
  active: boolean
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Testimonial {
  id: string
  customerName: string
  companyName?: string
  message: string
  rating: number
  active: boolean
  order: number
  createdAt: Date
}

export interface SystemLog {
  id: string
  userId?: string
  userEmail?: string
  action: string
  details: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  subscribed: boolean
  subscribedAt: Date
  unsubscribedAt?: Date
}

export interface SocialWidget {
  id: string
  type: 'facebook' | 'instagram' | 'reel'
  url: string
  iframeCode?: string  // Código iframe completo para reels
  position: number
  active: boolean
  createdAt: Date
  updatedAt: Date
}