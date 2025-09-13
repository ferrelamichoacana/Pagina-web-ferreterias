'use client'

import { useState, useEffect } from 'react'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  where 
} from 'firebase/firestore'
import { getFirestore, checkFirebaseAvailability } from '@/lib/firebase/utils'
import type { 
  Branch, 
  Brand, 
  NewsItem, 
  Testimonial, 
  User,
  ContactRequest,
  JobPosting,
  ITTicket 
} from '@/types'

// Hook para obtener sucursales desde Firebase
export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!checkFirebaseAvailability()) {
      setError('Firebase no está configurado')
      setLoading(false)
      return
    }

    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(collection(db, 'branches'), orderBy('createdAt')),
      (snapshot) => {
        const branchesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as Branch[]
        
        setBranches(branchesData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching branches:', err)
        setError('Error al cargar sucursales')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { branches, loading, error }
}

// Hook para obtener marcas desde Firebase
export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  // Función para forzar una recarga de datos
  const refetch = () => {
    console.log('🔄 REFETCH INICIADO:', {
      timestamp: new Date().toISOString(),
      currentTrigger: refetchTrigger,
      newTrigger: refetchTrigger + 1,
      currentBrands: brands.length,
      loading
    })
    
    setRefetchTrigger(prev => {
      const newValue = prev + 1
      console.log('📈 Trigger actualizado:', { from: prev, to: newValue })
      return newValue
    })
    
    setLoading(true)
    console.log('⏳ Loading establecido en true')
  }

  useEffect(() => {
    console.log('🔄 USEEFFECT useBrands INICIADO:', {
      refetchTrigger,
      timestamp: new Date().toISOString(),
      currentBrands: brands.length
    })
    
    // Verificar disponibilidad de Firebase
    const isFirebaseAvailable = checkFirebaseAvailability()
    console.log('🔥 Firebase status:', isFirebaseAvailable)
    
    if (!isFirebaseAvailable) {
      console.error('❌ Firebase no configurado')
      setError('Firebase no está configurado')
      setLoading(false)
      return
    }

    const db = getFirestore()
    console.log('🗄️  Firestore DB obtenido')

    const unsubscribe = onSnapshot(
      collection(db, 'brands'), // Query simple sin orderBy para evitar el índice compuesto
      (snapshot) => {
        console.log('📥 SNAPSHOT RECIBIDO:', {
          size: snapshot.size,
          empty: snapshot.empty,
          docs: snapshot.docs.length,
          timestamp: new Date().toISOString(),
          refetchTrigger
        })
        
        const brandsData = snapshot.docs.map(doc => {
          const data = doc.data()
          console.log('📄 Documento procesado:', { id: doc.id, name: data.name || 'Sin nombre' })
          return {
            id: doc.id,
            ...data,
          }
        }) as Brand[]
        
        // Ordenar en el cliente para evitar problemas de índice
        brandsData.sort((a, b) => a.name.localeCompare(b.name))
        
        console.log('✅ MARCAS PROCESADAS Y ORDENADAS:', {
          total: brandsData.length,
          marcas: brandsData.map(b => ({ id: b.id, name: b.name })),
          timestamp: new Date().toISOString()
        })
        
        setBrands(brandsData)
        console.log('📊 setBrands ejecutado con', brandsData.length, 'marcas')
        
        setLoading(false)
        console.log('⏳ Loading establecido en false')
        
        setError(null)
        console.log('❌ Error limpiado')
      },
      (err) => {
        console.error('� ERROR EN SNAPSHOT:', {
          error: err,
          code: err.code,
          message: err.message,
          stack: err.stack,
          timestamp: new Date().toISOString()
        })
        setError(`Error al cargar marcas: ${err.message}`)
        setLoading(false)
      }
    )

    console.log('👂 Listener de Firebase configurado')

    return () => {
      console.log('🧹 LIMPIANDO useBrands subscription:', {
        refetchTrigger,
        timestamp: new Date().toISOString()
      })
      unsubscribe()
    }
  }, [refetchTrigger]) // refetchTrigger es la única dependencia necesaria

  console.log('📊 ESTADO FINAL useBrands:', {
    brandsCount: brands.length,
    loading,
    error,
    brands: brands.slice(0, 3).map(b => ({ id: b.id, name: b.name })), // Solo mostrar las primeras 3 para debug
    refetchTrigger,
    timestamp: new Date().toISOString()
  })

  return { brands, loading, error, refetch }
}

// Hook para obtener configuración del sistema
export function useSystemConfig() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      doc(db, 'systemConfig', 'general'),
      (doc) => {
        if (doc.exists()) {
          setConfig({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          })
        }
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching system config:', err)
        setError('Error al cargar configuración')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { config, loading, error }
}

// Hook para obtener testimonios
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'testimonials'), 
        where('active', '==', true), 
        orderBy('order', 'asc')
      ),
      (snapshot) => {
        const testimonialsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Testimonial[]
        
        setTestimonials(testimonialsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching testimonials:', err)
        setError('Error al cargar testimonios')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { testimonials, loading, error }
}

// Hook para obtener noticias/promociones
export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'news'), 
        where('active', '==', true), 
        orderBy('order', 'asc')
      ),
      (snapshot) => {
        const newsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as NewsItem[]
        
        setNews(newsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching news:', err)
        setError('Error al cargar noticias')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { news, loading, error }
}

// Hook para obtener usuarios (solo para admin/IT)
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt')),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as User[]
        
        setUsers(usersData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching users:', err)
        setError('Error al cargar usuarios')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { users, loading, error }
}

// Hook para obtener solicitudes de contacto
export function useContactRequests(filters?: { branchId?: string; assignedTo?: string; status?: string }) {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    let q = query(collection(db, 'contactRequests'), orderBy('createdAt', 'desc'))

    // Aplicar filtros si se proporcionan
    if (filters?.branchId) {
      q = query(q, where('branchId', '==', filters.branchId))
    }
    if (filters?.assignedTo) {
      q = query(q, where('assignedTo', '==', filters.assignedTo))
    }
    if (filters?.status) {
      q = query(q, where('status', '==', filters.status))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requestsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as ContactRequest[]
        
        setRequests(requestsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching contact requests:', err)
        setError('Error al cargar solicitudes')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [filters])

  return { requests, loading, error }
}

// Hook genérico para cualquier colección
export function useCollection<T>(collectionName: string, queryConstraints?: any[]) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    let q = collection(db, collectionName)
    
    if (queryConstraints && queryConstraints.length > 0) {
      q = query(q, ...queryConstraints) as any
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as T[]
        
        setData(items)
        setLoading(false)
      },
      (err) => {
        console.error(`Error fetching ${collectionName}:`, err)
        setError(`Error al cargar ${collectionName}`)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, queryConstraints])

  return { data, loading, error }
}