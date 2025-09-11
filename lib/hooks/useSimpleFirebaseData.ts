'use client'

import { useState, useEffect } from 'react'
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

// Types para los datos
interface Branch {
  id: string
  customId: string
  name: string
  city: string
  state: string
  address: string
  phone: string
  email: string
  schedule: string
  coordinates: { lat: number; lng: number }
  isMain: boolean
  managerId: string | null
  services: string[]
  active: boolean
  createdAt: Date
  updatedAt: Date
}

interface Brand {
  id: string
  customId: string
  name: string
  logo: string
  category: string
  featured: boolean
  active: boolean
  description?: string
  website?: string
  createdAt: Date
  updatedAt: Date
}

// Datos mock como fallback si Firebase no está disponible
const mockBranches = [
  {
    id: '1',
    customId: 'puente',
    name: 'Sucursal Puente',
    city: 'Morelia',
    state: 'Michoacán',
    address: 'Av. Puente #123, Col. Puente',
    phone: '(443) 123-4567',
    email: 'puente@ferreterialamichoacana.com',
    schedule: 'Lun-Vie: 8:00-19:00, Sáb: 8:00-17:00, Dom: 9:00-15:00',
    coordinates: { lat: 19.7026, lng: -101.1947 },
    isMain: true,
    managerId: null,
    services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio', 'Asesoría técnica'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    customId: 'santa-barbara',
    name: 'Sucursal Santa Barbara',
    city: 'Morelia',
    state: 'Michoacán',
    address: 'Av. Santa Barbara #456, Col. Santa Barbara',
    phone: '(443) 234-5678',
    email: 'santabarbara@ferreterialamichoacana.com',
    schedule: 'Lun-Vie: 8:00-18:00, Sáb: 8:00-16:00',
    coordinates: { lat: 19.6888, lng: -101.1844 },
    isMain: false,
    managerId: null,
    services: ['Venta al público', 'Venta mayorista', 'Entrega a domicilio'],
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

const mockBrands = [
  {
    id: '1',
    customId: '1',
    name: 'Häfele',
    logo: '/images/haefele_logo.png',
    category: 'Herrajes',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    customId: '2',
    name: 'Cerrajes',
    logo: '/images/logo_cerrajes.png',
    category: 'Cerrajes',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    customId: '3',
    name: 'HandyHome',
    logo: '/images/logo_handyhome.png',
    category: 'Herrajes, Jaladeras y Accesorios',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '4',
    customId: '4',
    name: 'HERMA',
    logo: '/images/logo_herma.png',
    category: 'Cerraduras y Herrajes',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '5',
    customId: '5',
    name: 'Soarma',
    logo: '/images/logo_soarma.png',
    category: 'Herrajes y Accesorios',
    featured: true,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

// Hook para manejo de datos Firebase con fallback a mocks
export function useSimpleFirebaseData() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingMocks, setUsingMocks] = useState(false)

  // Función para obtener sucursales
  const fetchBranches = async () => {
    if (!db) {
      console.warn('🔧 Firebase no está configurado, usando datos mock para sucursales')
      setBranches(mockBranches)
      setUsingMocks(true)
      return mockBranches
    }

    try {
      const branchesRef = collection(db, 'branches')
      const q = query(branchesRef, where('active', '==', true), orderBy('name'))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        console.warn('📭 No hay sucursales en Firestore, usando datos mock')
        setBranches(mockBranches)
        setUsingMocks(true)
        return mockBranches
      }
      
      const branchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Branch[]
      
      console.log(`🏢 Cargadas ${branchesData.length} sucursales desde Firestore`)
      setBranches(branchesData)
      setUsingMocks(false)
      return branchesData
    } catch (error) {
      console.error('❌ Error fetching branches, usando mock:', error)
      setBranches(mockBranches)
      setUsingMocks(true)
      return mockBranches
    }
  }

  // Función para obtener marcas
  const fetchBrands = async () => {
    if (!db) {
      console.warn('🔧 Firebase no está configurado, usando datos mock para marcas')
      setBrands(mockBrands)
      setUsingMocks(true)
      return mockBrands
    }

    try {
      const brandsRef = collection(db, 'brands')
      const q = query(brandsRef, where('active', '==', true), orderBy('name'))
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        console.warn('📭 No hay marcas en Firestore, usando datos mock')
        setBrands(mockBrands)
        setUsingMocks(true)
        return mockBrands
      }
      
      const brandsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Brand[]
      
      console.log(`🏷️ Cargadas ${brandsData.length} marcas desde Firestore`)
      setBrands(brandsData)
      setUsingMocks(false)
      return brandsData
    } catch (error) {
      console.error('❌ Error fetching brands, usando mock:', error)
      setBrands(mockBrands)
      setUsingMocks(true)
      return mockBrands
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        await Promise.all([
          fetchBranches(),
          fetchBrands()
        ])
      } catch (error) {
        console.error('💥 Error al cargar datos:', error)
        setError('Error al cargar datos')
        // En caso de error, usar mocks
        setBranches(mockBranches)
        setBrands(mockBrands)
        setUsingMocks(true)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return {
    branches,
    brands,
    loading,
    error,
    usingMocks,
    refresh: () => {
      fetchBranches()
      fetchBrands()
    }
  }
}

// Export both named and default for compatibility
export default useSimpleFirebaseData