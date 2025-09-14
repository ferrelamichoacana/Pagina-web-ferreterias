'use client'

import React, { useState, useEffect } from 'react'
import { FacebookEmbed } from 'react-social-media-embed'
import { useSocialWidgets } from '@/lib/hooks/useFirebaseData'

interface SocialWidgetProps {
  widget: {
    id: string
    type: 'facebook' | 'instagram'
    url: string
    position: number
    active: boolean
  }
  index: number
}

const SocialWidgetItem: React.FC<SocialWidgetProps> = ({ widget, index }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Delay based on position for staggered animation
          setTimeout(() => {
            setIsVisible(true)
          }, index * 200)
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    )

    const element = document.getElementById(`social-widget-${widget.id}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [widget.id, index])

  // Posiciones desacomodadas para diferentes widgets
  const getRandomPosition = () => {
    const positions = [
      'left-4 md:left-8',
      'right-4 md:right-8', 
      'left-1/2 transform -translate-x-1/2',
      'right-12 md:right-20',
      'left-12 md:left-20'
    ]
    return positions[index % positions.length]
  }

  return (
    <div
      id={`social-widget-${widget.id}`}
      className={`
        social-widget social-widget-${(index % 5) + 1}
        fixed z-10 transition-all duration-1000 ease-out
        ${getRandomPosition()}
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
        hover:scale-105 hover:z-20
        w-80 max-w-[90vw]
      `}
      style={{
        top: `${60 + (index * 120)}vh`, // Espaciado vertical
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl p-3 border-2 border-gray-100 hover:shadow-3xl transition-shadow duration-300">
        {widget.type === 'facebook' && (
          <div className="overflow-hidden rounded-lg">
            <FacebookEmbed
              url={widget.url}
              width="100%"
              height={400}
            />
          </div>
        )}
        
        {/* Badge de posición */}
        <div className="absolute -top-2 -right-2 bg-primary-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
          {widget.position}
        </div>
      </div>
    </div>
  )
}

export default function SocialWidgets() {
  const { widgets, loading, error } = useSocialWidgets()

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="text-sm text-gray-600">Cargando reels...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return null // No mostrar errores en el frontend
  }

  if (!widgets || widgets.length === 0) {
    return null
  }

  return (
    <>
      {widgets.map((widget, index) => (
        <SocialWidgetItem
          key={widget.id}
          widget={widget}
          index={index}
        />
      ))}
      
      {/* Indicador de scroll para móvil */}
      <div className="fixed bottom-4 left-4 z-30 md:hidden">
        <div className="bg-black/80 text-white rounded-full px-3 py-2 text-xs">
          📱 Scroll para ver reels
        </div>
      </div>
    </>
  )
}
