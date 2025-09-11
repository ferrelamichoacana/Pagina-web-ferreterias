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
import { db } from '@/lib/firebase'
import { realBranches, realBrands } from '@/lib/data/realData'

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

// Datos mock como fallback si Firebase no está disponible - DATOS REALES
const mockBranches = realBranches.map(branch => ({
  ...branch,
  customId: branch.id,
  createdAt: new Date(),
  updatedAt: new Date()
}))

const mockBrands = realBrands.map(brand => ({
  ...brand,
  customId: brand.id,
  createdAt: new Date(),
  updatedAt: new Date()
}))

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