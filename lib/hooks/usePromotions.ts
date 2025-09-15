'use client'

import { useState, useEffect } from 'react'
import { Promotion } from '@/types'

interface UsePromotionsReturn {
  promotions: Promotion[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePromotions(): UsePromotionsReturn {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/promotions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.success) {
        // Procesar las fechas para asegurar que sean objetos Date válidos
        const processedPromotions = (data.data || []).map((promotion: any) => ({
          ...promotion,
          startDate: new Date(promotion.startDate),
          endDate: new Date(promotion.endDate),
          createdAt: promotion.createdAt ? new Date(promotion.createdAt) : new Date(),
          updatedAt: promotion.updatedAt ? new Date(promotion.updatedAt) : new Date(),
        }))
        
        setPromotions(processedPromotions)
        
        // Si hay advertencia, mostrarla en consola
        if (data.warning) {
          console.warn('Promotions API warning:', data.warning)
        }
      } else {
        throw new Error(data.error || 'Error desconocido al obtener promociones')
      }
    } catch (err) {
      console.error('Error fetching promotions:', err)
      setError(err instanceof Error ? err.message : 'Error al cargar promociones')
      setPromotions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  return {
    promotions,
    loading,
    error,
    refetch: fetchPromotions
  }
}

// Hook para crear, actualizar y eliminar promociones (para admin)
interface UsePromotionsAdminReturn extends UsePromotionsReturn {
  createPromotion: (promotionData: Partial<Promotion>) => Promise<boolean>
  updatePromotion: (id: string, promotionData: Partial<Promotion>) => Promise<boolean>
  deletePromotion: (id: string) => Promise<boolean>
  reorderPromotions: (promotionIds: string[]) => Promise<boolean>
  creating: boolean
  updating: boolean
  deleting: boolean
}

export function usePromotionsAdmin(authToken?: string): UsePromotionsAdminReturn {
  const { promotions, loading, error, refetch } = usePromotions()
  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const createPromotion = async (promotionData: Partial<Promotion>): Promise<boolean> => {
    if (!authToken) {
      console.error('Token de autenticación requerido')
      return false
    }

    try {
      setCreating(true)

      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(promotionData),
      })

      const data = await response.json()

      if (data.success) {
        await refetch() // Refrescar la lista
        return true
      } else {
        console.error('Error creating promotion:', data.error)
        return false
      }
    } catch (err) {
      console.error('Error creating promotion:', err)
      return false
    } finally {
      setCreating(false)
    }
  }

  const updatePromotion = async (id: string, promotionData: Partial<Promotion>): Promise<boolean> => {
    if (!authToken) {
      console.error('Token de autenticación requerido')
      return false
    }

    try {
      setUpdating(true)

      const response = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(promotionData),
      })

      const data = await response.json()

      if (data.success) {
        await refetch() // Refrescar la lista
        return true
      } else {
        console.error('Error updating promotion:', data.error)
        return false
      }
    } catch (err) {
      console.error('Error updating promotion:', err)
      return false
    } finally {
      setUpdating(false)
    }
  }

  const deletePromotion = async (id: string): Promise<boolean> => {
    if (!authToken) {
      console.error('Token de autenticación requerido')
      return false
    }

    try {
      setDeleting(true)

      const response = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      })

      const data = await response.json()

      if (data.success) {
        await refetch() // Refrescar la lista
        return true
      } else {
        console.error('Error deleting promotion:', data.error)
        return false
      }
    } catch (err) {
      console.error('Error deleting promotion:', err)
      return false
    } finally {
      setDeleting(false)
    }
  }

  const reorderPromotions = async (promotionIds: string[]): Promise<boolean> => {
    if (!authToken) {
      console.error('Token de autenticación requerido')
      return false
    }

    try {
      const response = await fetch('/api/promotions/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ promotionIds }),
      })

      const data = await response.json()

      if (data.success) {
        await refetch() // Refrescar la lista
        return true
      } else {
        console.error('Error reordering promotions:', data.error)
        return false
      }
    } catch (err) {
      console.error('Error reordering promotions:', err)
      return false
    }
  }

  return {
    promotions,
    loading,
    error,
    refetch,
    createPromotion,
    updatePromotion,
    deletePromotion,
    reorderPromotions,
    creating,
    updating,
    deleting
  }
}