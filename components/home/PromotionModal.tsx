'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Calendar, MapPin, Phone, Mail } from 'lucide-react'
import { Promotion } from '@/types'

interface PromotionModalProps {
  promotion: Promotion | null
  isOpen: boolean
  onClose: () => void
}

export default function PromotionModal({
  promotion,
  isOpen,
  onClose
}: PromotionModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  // Format dates
  const formatDate = (date: Date | string) => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date
      if (!(d instanceof Date) || isNaN(d.getTime())) {
        return 'Fecha no disponible'
      }
      return d.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Fecha no disponible'
    }
  }

  if (!isOpen || !promotion) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
      >
        {/* Header with close button */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
          {/* Image Section */}
          <div className="relative h-64 lg:h-full">
            <Image
              src={promotion.imageUrl || '/images/placeholder-promotion.jpg'}
              alt={promotion.title || 'Promoción'}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/30" />
            
            {/* Overlay badge */}
            <div className="absolute top-4 left-4">
              <div className="px-3 py-1 bg-orange-500 text-white text-sm font-semibold rounded-full">
                Promoción Especial
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6 lg:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {promotion.title || 'Promoción Especial'}
              </h2>
              
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {promotion.description || 'Descripción no disponible'}
              </p>

              {/* Dates */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  <div>
                    <div className="text-sm font-medium">Válido desde</div>
                    <div className="text-lg font-semibold">
                      {formatDate(promotion.startDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2 text-red-500" />
                  <div>
                    <div className="text-sm font-medium">Válido hasta</div>
                    <div className="text-lg font-semibold">
                      {formatDate(promotion.endDate)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {promotion.contactInfo && (
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-500" />
                    Información de Contacto
                  </h3>
                  <div className="text-gray-700 whitespace-pre-line">
                    {promotion.contactInfo}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2 text-purple-500" />
                  <span>Disponible en todas nuestras sucursales</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Válido hasta agotar existencias</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={() => {
                  // Aquí podrías agregar lógica para contactar o mostrar más información
                  window.open('tel:+523333010376', '_self')
                }}
                className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Llamar Ahora
              </button>
              <button
                onClick={() => {
                  // Aquí podrías agregar lógica para ir a sucursales
                  window.open('/sucursales', '_blank')
                }}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Ver Sucursales
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              * Promoción válida únicamente en las fechas indicadas. Sujeto a términos y condiciones.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook personalizado para manejar el modal
export function usePromotionModal() {
  const [selectedPromotion, setSelectedPromotion] = React.useState<Promotion | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const openModal = (promotion: Promotion) => {
    setSelectedPromotion(promotion)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setTimeout(() => setSelectedPromotion(null), 300) // Wait for animation
  }

  return {
    selectedPromotion,
    isModalOpen,
    openModal,
    closeModal
  }
}