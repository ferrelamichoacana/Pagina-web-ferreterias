'use client'

import { useState } from 'react'

// Hook para configuración del sistema
export function useSystemConfig() {
  const [config] = useState({
    companyName: 'Ferretería La Michoacana',
    slogan: 'Tu ferretería de confianza desde hace 8 años',
    description: 'Herramientas, materiales de construcción y todo lo que necesitas para tus proyectos',
    heroTitle: 'Bienvenidos a Ferretería La Michoacana',
    heroSubtitle: 'Tu ferretería de confianza desde hace 8 años',
    phone: '+52 443 123 4567',
    email: 'contacto@ferreterialamichoacana.com',
    address: 'Av. Madero #123, Centro, Morelia, Michoacán'
  })
  const [loading] = useState(false)
  const [error] = useState(null)

  // Por ahora retornamos configuración estática
  // En el futuro se puede conectar a Firebase
  return {
    config,
    loading,
    error
  }
}
