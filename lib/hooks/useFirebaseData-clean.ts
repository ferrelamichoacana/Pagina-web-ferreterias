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

// Hook para obtener marcas desde Firebase - VERSIÓN LIMPIA
export function useBrands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refetchTrigger, setRefetchTrigger] = useState(0)

  // Función para forzar una recarga de datos
  const refetch = () => {
    setRefetchTrigger(prev => prev + 1)
    setLoading(true)
  }

  useEffect(() => {
    // Verificar disponibilidad de Firebase
    if (!checkFirebaseAvailability()) {
      setError('Firebase no está configurado')
      setLoading(false)
      return
    }

    const db = getFirestore()

    const unsubscribe = onSnapshot(
      collection(db, 'brands'),
      (snapshot) => {
        const brandsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Brand[]
        
        // Ordenar en el cliente para evitar problemas de índice
        brandsData.sort((a, b) => a.name.localeCompare(b.name))
        
        setBrands(brandsData)
        setLoading(false)
        setError(null)
      },
      (err) => {
        console.error('Error loading brands:', err.message)
        setError(`Error al cargar marcas: ${err.message}`)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [refetchTrigger])

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
      query(collection(db, 'testimonials'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const testimonialsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
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

// Hook para obtener noticias
export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(collection(db, 'news'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const newsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          publishDate: doc.data().publishDate?.toDate() || new Date(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
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

// Hook para obtener usuarios
export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(collection(db, 'users'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          lastLogin: doc.data().lastLogin?.toDate() || null,
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
export function useContactRequests() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(collection(db, 'contactRequests'), orderBy('createdAt', 'desc')),
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
        setError('Error al cargar solicitudes de contacto')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { requests, loading, error }
}

// Hook para obtener publicaciones de empleo
export function useJobPostings() {
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(collection(db, 'jobPostings'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const jobsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          deadline: doc.data().deadline?.toDate() || null,
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        })) as JobPosting[]
        
        setJobs(jobsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching job postings:', err)
        setError('Error al cargar ofertas de empleo')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { jobs, loading, error }
}

// Hook para obtener tickets de IT
export function useITTickets() {
  const [tickets, setTickets] = useState<ITTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const db = getFirestore()
    const unsubscribe = onSnapshot(
      query(collection(db, 'itTickets'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const ticketsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate() || new Date(),
          resolvedAt: doc.data().resolvedAt?.toDate() || null,
        })) as ITTicket[]
        
        setTickets(ticketsData)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching IT tickets:', err)
        setError('Error al cargar tickets de IT')
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  return { tickets, loading, error }
}

// Hook para obtener un documento específico por ID
export function useDocument<T>(collectionName: string, docId: string) {
  const [document, setDocument] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!docId) {
      setLoading(false)
      return
    }

    const db = getFirestore()
    const unsubscribe = onSnapshot(
      doc(db, collectionName, docId),
      (doc) => {
        if (doc.exists()) {
          setDocument({
            id: doc.id,
            ...doc.data(),
          } as T)
        } else {
          setDocument(null)
        }
        setLoading(false)
      },
      (err) => {
        console.error(`Error fetching document ${docId}:`, err)
        setError(`Error al cargar documento`)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [collectionName, docId])

  return { document, loading, error }
}
