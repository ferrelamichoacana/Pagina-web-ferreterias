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
import { db } from '@/lib/firebase'
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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'brands'), where('active', '==', true), orderBy('name')),
      (snapshot) => {
        const brandsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Brand[]
        
        setBrands(brandsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching brands:', err)
        setError('Error al cargar marcas')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { brands, loading, error }
}

// Hook para obtener configuración del sistema
export function useSystemConfig() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
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