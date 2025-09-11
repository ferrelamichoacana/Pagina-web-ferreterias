// Configuración centralizada para páginas de mantenimiento
// Permite habilitar/deshabilitar funcionalidades fácilmente

export interface MaintenanceConfig {
  enabled: boolean
  title?: string
  message?: string
  estimatedTime?: string
  priority: 'low' | 'medium' | 'high'
  contactInfo?: boolean
}

// Configuración de mantenimiento por página/funcionalidad
export const maintenanceSettings: Record<string, MaintenanceConfig> = {
  // Autenticación
  login: {
    enabled: true,
    title: 'Inicio de Sesión',
    message: 'El sistema de autenticación está siendo configurado con las mejores prácticas de seguridad.',
    estimatedTime: 'Próximamente',
    priority: 'high',
    contactInfo: true
  },

  register: {
    enabled: true,
    title: 'Crear Cuenta',
    message: 'El sistema de registro está siendo desarrollado para ofrecerte la mejor experiencia.',
    estimatedTime: 'Próximamente',
    priority: 'high',
    contactInfo: true
  },

  // Formularios
  contactForm: {
    enabled: true,
    title: 'Formulario de Contacto',
    message: 'Estamos configurando nuestro sistema de cotizaciones para procesar tu solicitud automáticamente.',
    estimatedTime: 'En desarrollo',
    priority: 'high',
    contactInfo: true
  },

  // Dashboards
  clientDashboard: {
    enabled: true,
    title: 'Panel de Cliente',
    message: 'Tu panel personal está siendo desarrollado para gestionar solicitudes y comunicarte con vendedores.',
    estimatedTime: 'En desarrollo activo',
    priority: 'high',
    contactInfo: false
  },

  vendorDashboard: {
    enabled: true,
    title: 'Panel de Vendedor',
    message: 'El sistema de gestión para vendedores incluirá herramientas avanzadas de seguimiento y comunicación.',
    estimatedTime: 'Fase de desarrollo',
    priority: 'medium',
    contactInfo: false
  },

  managerDashboard: {
    enabled: true,
    title: 'Panel de Gerente',
    message: 'Las herramientas de gestión para gerentes están siendo desarrolladas con funcionalidades completas.',
    estimatedTime: 'En planificación',
    priority: 'medium',
    contactInfo: false
  },

  hrDashboard: {
    enabled: true,
    title: 'Panel de RRHH',
    message: 'El sistema ATS (Applicant Tracking System) está en desarrollo para gestión completa de candidatos.',
    estimatedTime: 'Sistema ATS en desarrollo',
    priority: 'medium',
    contactInfo: false
  },

  itDashboard: {
    enabled: true,
    title: 'Panel de IT',
    message: 'El sistema de gestión de tickets IT incluirá herramientas avanzadas de seguimiento y resolución.',
    estimatedTime: 'Sistema de tickets en desarrollo',
    priority: 'low',
    contactInfo: false
  },

  // Funcionalidades específicas
  jobBoard: {
    enabled: true,
    title: 'Bolsa de Trabajo',
    message: 'Nuestra plataforma de empleos está siendo desarrollada para conectar talento con oportunidades.',
    estimatedTime: 'Próximamente',
    priority: 'medium',
    contactInfo: true
  },

  chat: {
    enabled: true,
    title: 'Chat en Tiempo Real',
    message: 'El sistema de mensajería instantánea está siendo implementado para comunicación directa.',
    estimatedTime: 'En desarrollo',
    priority: 'high',
    contactInfo: false
  },

  fileUpload: {
    enabled: true,
    title: 'Subida de Archivos',
    message: 'El sistema de gestión de archivos está siendo configurado con Cloudinary.',
    estimatedTime: 'En desarrollo',
    priority: 'medium',
    contactInfo: false
  },

  // Integraciones
  maps: {
    enabled: false, // Ya implementado en sucursales
    title: 'Mapas Interactivos',
    message: 'Los mapas interactivos están siendo integrados con Google Maps API.',
    estimatedTime: 'Completado',
    priority: 'low',
    contactInfo: false
  },

  payments: {
    enabled: true,
    title: 'Sistema de Pagos',
    message: 'Las funcionalidades de pago están siendo evaluadas para futuras implementaciones.',
    estimatedTime: 'En evaluación',
    priority: 'low',
    contactInfo: true
  }
}

// Función para obtener configuración de mantenimiento
export function getMaintenanceConfig(key: string): MaintenanceConfig | null {
  return maintenanceSettings[key] || null
}

// Función para verificar si una funcionalidad está en mantenimiento
export function isInMaintenance(key: string): boolean {
  const config = getMaintenanceConfig(key)
  return config?.enabled || false
}

// Función para obtener todas las funcionalidades en mantenimiento por prioridad
export function getMaintenanceByPriority(priority: 'low' | 'medium' | 'high') {
  return Object.entries(maintenanceSettings)
    .filter(([_, config]) => config.enabled && config.priority === priority)
    .map(([key, config]) => ({ key, ...config }))
}

// Función para obtener estadísticas de desarrollo
export function getDevelopmentStats() {
  const total = Object.keys(maintenanceSettings).length
  const inMaintenance = Object.values(maintenanceSettings).filter(config => config.enabled).length
  const completed = total - inMaintenance
  
  const byPriority = {
    high: getMaintenanceByPriority('high').length,
    medium: getMaintenanceByPriority('medium').length,
    low: getMaintenanceByPriority('low').length
  }

  return {
    total,
    inMaintenance,
    completed,
    completionPercentage: Math.round((completed / total) * 100),
    byPriority
  }
}

// Configuración global de mantenimiento
export const globalMaintenanceConfig = {
  // Información de contacto por defecto
  defaultContact: {
    phone: '(443) 123-4567',
    email: 'soporte@ferreterialamichoacana.com',
    whatsapp: '+524431234567'
  },

  // Mensajes por defecto
  defaultMessages: {
    es: {
      title: 'Funcionalidad en Desarrollo',
      message: 'Esta funcionalidad está siendo desarrollada para ofrecerte la mejor experiencia.',
      estimatedTime: 'Próximamente'
    },
    en: {
      title: 'Feature in Development',
      message: 'This feature is being developed to offer you the best experience.',
      estimatedTime: 'Coming Soon'
    }
  },

  // Configuración de notificaciones
  notifications: {
    showProgress: true,
    showEstimatedTime: true,
    showContactInfo: true,
    allowSubscription: false // Para futuras notificaciones de disponibilidad
  }
}

/*
 * NOTAS PARA USO:
 * 
 * 1. Para deshabilitar mantenimiento de una funcionalidad:
 *    maintenanceSettings.login.enabled = false
 * 
 * 2. Para usar en componentes:
 *    const config = getMaintenanceConfig('login')
 *    if (config?.enabled) {
 *      return <MaintenancePage {...config} />
 *    }
 * 
 * 3. Para estadísticas de desarrollo:
 *    const stats = getDevelopmentStats()
 *    console.log(`Progreso: ${stats.completionPercentage}%`)
 * 
 * 4. Para páginas condicionales:
 *    if (isInMaintenance('chat')) {
 *      // Mostrar mantenimiento
 *    } else {
 *      // Mostrar funcionalidad real
 *    }
 */