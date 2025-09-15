'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Promotion } from '@/types'

interface PromotionsCarouselProps {
  promotions: Promotion[]
  autoScrollInterval?: number
  onPromotionClick?: (promotion: Promotion) => void
  className?: string
}

export default function PromotionsCarousel({
  promotions,
  autoScrollInterval = 7000, // 7 segundos por defecto
  onPromotionClick,
  className = ''
}: PromotionsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Filtrar promociones activas y válidas por fecha
  const activePromotions = promotions.filter(promotion => {
    if (!promotion.active) return false
    
    const now = new Date()
    const startDate = new Date(promotion.startDate)
    const endDate = new Date(promotion.endDate)
    
    return now >= startDate && now <= endDate
  })

  // Función para ir a la siguiente promoción
  const goToNext = useCallback(() => {
    if (activePromotions.length <= 1) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === activePromotions.length - 1 ? 0 : prevIndex + 1
      )
      setIsTransitioning(false)
    }, 150)
  }, [activePromotions.length])

  // Función para ir a la promoción anterior
  const goToPrevious = useCallback(() => {
    if (activePromotions.length <= 1) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? activePromotions.length - 1 : prevIndex - 1
      )
      setIsTransitioning(false)
    }, 150)
  }, [activePromotions.length])

  // Función para ir a una promoción específica
  const goToSlide = useCallback((index: number) => {
    if (index === currentIndex || activePromotions.length <= 1) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsTransitioning(false)
    }, 150)
  }, [currentIndex, activePromotions.length])

  // Auto-scroll effect
  useEffect(() => {
    if (!isPlaying || activePromotions.length <= 1) return

    const intervalId = setInterval(() => {
      goToNext()
    }, autoScrollInterval)

    return () => clearInterval(intervalId)
  }, [isPlaying, goToNext, autoScrollInterval, activePromotions.length])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious()
      } else if (event.key === 'ArrowRight') {
        goToNext()
      } else if (event.key === ' ') {
        event.preventDefault()
        setIsPlaying(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [goToNext, goToPrevious])

  // Si no hay promociones activas, no mostrar el carousel
  if (activePromotions.length === 0) {
    return null
  }

  const currentPromotion = activePromotions[currentIndex]

  return (
    <div className={`relative w-full bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden ${className}`}>
      {/* Carousel Container */}
      <div className="relative h-64 md:h-80 lg:h-96">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src={currentPromotion.imageUrl || '/images/placeholder-promotion.jpg'}
            alt={currentPromotion.title || 'Promoción'}
            fill
            className={`object-cover transition-opacity duration-300 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}
            priority={currentIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h2 
                className={`text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                {currentPromotion.title || 'Promoción Especial'}
              </h2>
              <p 
                className={`text-lg md:text-xl text-gray-200 mb-6 line-clamp-3 transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                {currentPromotion.description || 'Descripción no disponible'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onPromotionClick?.(currentPromotion)}
                  className={`px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 ${
                    isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                  }`}
                >
                  Ver Detalles
                </button>
                <div className={`text-sm text-gray-300 flex items-center transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}>
                  <span>Válido hasta: {new Date(currentPromotion.endDate).toLocaleDateString('es-MX')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        {activePromotions.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Promoción anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Siguiente promoción"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Play/Pause Button */}
        {activePromotions.length > 1 && (
          <button
            onClick={() => setIsPlaying(prev => !prev)}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all duration-200 backdrop-blur-sm"
            aria-label={isPlaying ? 'Pausar auto-scroll' : 'Reanudar auto-scroll'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Indicators */}
      {activePromotions.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {activePromotions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Ir a promoción ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {activePromotions.length > 1 && isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-100 ease-linear"
            style={{
              width: `${((Date.now() % autoScrollInterval) / autoScrollInterval) * 100}%`,
              animation: `progressBar ${autoScrollInterval}ms linear infinite`
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}