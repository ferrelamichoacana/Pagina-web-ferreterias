'use client'

import { useState, useEffect } from 'react'

// Datos mock para desarrollo sin Firebase
const mockBranches = [
  {
    id: '1',
    name: 'Sucursal Puente',
    address: 'Av. Paseo Constituyentes , El Pueblito, Qro., 76900, Corregidora, Qro. México.',
    phone: '(442) 786 0631',
    manager: '',
    coordinates: { lat: 20.532214, lng: -100.441519 }
  },
  {
    id: '2',
    name: 'Sucursal Santa Bárbara',
    address: 'Sebastián Lerdo de Tejada #6 Col Santa Bárbara C.P. 76906, 76906 Qro.',
    phone: '(442) 677 0568',
    manager: '',
    coordinates: { lat: 20.528593, lng: -100.443397 }
  }
]

const mockBrands = [
  {
    id: '1',
    name: 'Häfele',
    logo: '/images/haefele_logo.png',
    category: 'Herrajes',
    featured: true,
    active: true
  },
  {
    id: '2',
    name: 'Cerrajes',
    logo: '/images/logo_cerrajes.png',
    category: 'Cerrajes',
    featured: true,
    active: true
  },
  {
    id: '3',
    name: 'HandyHome',
    logo: '/images/logo_handyhome.png',
    category: 'Herrajes, Jaladeras y Accesorios',
    featured: true,
    active: true
  },
  {
    id: '4',
    name: 'HERMA',
    logo: '/images/logo_herma.png',
    category: 'Cerraduras y Herrajes',
    featured: true,
    active: true
  },
  {
    id: '5',
    name: 'Soarma',
    logo: '/images/logo_soarma.png',
    category: 'Herrajes y Accesorios',
    featured: true,
    active: true
  },
  {
    id: '6',
    name: 'Sayer',
    logo: '/images/logo_sayer.png',
    category: 'Pinturas',
    featured: true,
    active: true
  },
  {
    id: '7',
    name: 'RESISTOL',
    logo: '/images/logo_resistol.png',
    category: 'Pegamentos',
    featured: true,
    active: true
  },
  {
    id: '8',
    name: 'TRUPER',
    logo: '/images/logo_truper.png',
    category: 'Herramientas',
    featured: true,
    active: true
  },
  {
    id: '9',
    name: 'DeWALT',
    logo: '/images/logo_dewalt.png',
    category: 'Herramientas',
    featured: true,
    active: true
  },
  {
    id: '10',
    name: 'Makita',
    logo: '/images/logo_makita.png',
    category: 'Herramientas',
    featured: true,
    active: true
  },
  {
    id: '11',
    name: 'Silverline',
    logo: '/images/logo_silverline.png',
    category: 'Maquinaria y Herramienta',
    featured: true,
    active: true
  }
]

const mockConfig = {
  content: {
    heroTitle: 'Ferretería La Michoacana',
    heroSubtitle: 'Tu ferretería de confianza con más de 8 años de experiencia',
    aboutTitle: '¿Quiénes Somos?',
    aboutDescription: 'Somos una empresa con más de 8 años de experiencia en el sector de materiales de construcción.'
  }
}

export function useBranches() {
  const [branches, setBranches] = useState(mockBranches)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { branches, loading, error, setBranches }
}

export function useBrands() {
  const [brands, setBrands] = useState(mockBrands)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { brands, loading, error, setBrands }
}

export function useSystemConfig() {
  const [config, setConfig] = useState(mockConfig)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return { config, loading, error, setConfig }
}