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
  const [hasError, setHasError] = useState(false)

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

  // Posiciones distribuidas estratégicamente en la página
  const getPositionStyles = () => {
    const positions = [
      { 
        left: '2rem',
        top: '20vh',
        className: 'left-8'
      },
      { 
        right: '2rem',
        top: '35vh',
        className: 'right-8'
      },
      { 
        left: '50%',
        top: '50vh',
        transform: 'translateX(-50%)',
        className: 'left-1/2 transform -translate-x-1/2'
      },
      { 
        right: '3rem',
        top: '65vh',
        className: 'right-12'
      },
      { 
        left: '3rem',
        top: '80vh',
        className: 'left-12'
      }
    ]
    return positions[index % positions.length]
  }

  const positionStyles = getPositionStyles()

  return (
    <div
      id={`social-widget-${widget.id}`}
      className={`
        social-widget social-widget-${(index % 5) + 1}
        fixed z-10 transition-all duration-1000 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
        hover:scale-105 hover:z-20
        w-72 max-w-[85vw] md:w-80
      `}
      style={{
        left: positionStyles.left,
        right: positionStyles.right,
        top: positionStyles.top,
        transform: positionStyles.transform
      }}
    >
      <div className="bg-white rounded-xl shadow-2xl p-3 border-2 border-gray-100 hover:shadow-3xl transition-shadow duration-300">
        {!hasError ? (
          <>
            {widget.type === 'facebook' && (
              <div className="overflow-hidden rounded-lg">
                <FacebookEmbed
                  url={widget.url}
                  width="100%"
                  height={350}
                  onError={() => setHasError(true)}
                />
              </div>
            )}
            
            {/* Badge de posición */}
            <div className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
              {widget.position}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-gray-500">
            <div className="text-4xl mb-4">📱</div>
            <p className="text-center text-sm">
              No se pudo cargar el contenido
            </p>
            <p className="text-center text-xs mt-2 text-gray-400">
              Verifica que la URL sea pública
            </p>
            <a 
              href={widget.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-3 text-primary-600 hover:text-primary-700 text-sm underline"
            >
              Ver en Facebook
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SocialWidgets() {
  const { widgets, loading, error } = useSocialWidgets()

  if (loading) {
    return null // No mostrar loader para widgets
  }

  if (error) {
    return null // No mostrar errores en el frontend
  }

  if (!widgets || widgets.length === 0) {
    return null
  }

  return (
    <>
      {/* Solo mostrar en pantallas medianas y grandes */}
      <div className="hidden md:block">
        {widgets.map((widget, index) => (
          <SocialWidgetItem
            key={widget.id}
            widget={widget}
            index={index}
          />
        ))}
      </div>
      
      {/* Indicador discreto para móvil */}
      <div className="fixed bottom-4 right-4 z-30 md:hidden">
        <div className="bg-primary-600 text-white rounded-full px-3 py-2 text-xs shadow-lg">
          📱 Síguenos en redes
        </div>
      </div>
    </>
  )
}
