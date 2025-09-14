'use client'

import React, { useState, useEffect } from 'react'
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

  // Función para extraer el ID del reel de Facebook
  const extractFacebookReelId = (url: string) => {
    const reelMatch = url.match(/facebook\.com\/reel\/(\d+)/)
    return reelMatch ? reelMatch[1] : null
  }

  // Función para extraer URL del iframe si es código HTML
  const extractIframeUrl = (content: string) => {
    const iframeMatch = content.match(/src="([^"]*)"/)
    return iframeMatch ? iframeMatch[1] : null
  }

  // Generar iframe URL para Facebook
  const getFacebookIframeUrl = (input: string) => {
    // Si ya es un iframe, extraer la URL
    if (input.includes('<iframe')) {
      const extractedUrl = extractIframeUrl(input)
      return extractedUrl
    }
    
    // Si es una URL directa, generar el iframe
    const reelId = extractFacebookReelId(input)
    if (reelId) {
      return `https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(input)}&show_text=false&width=267&t=0`
    }
    
    return null
  }

  // Posiciones distribuidas a lo largo del contenido
  const getPositionStyles = () => {
    const positions = [
      { 
        left: '2rem',
        top: '600px',
        className: 'left-8'
      },
      { 
        right: '2rem',
        top: '1200px',
        className: 'right-8'
      },
      { 
        left: '50%',
        top: '1800px',
        transform: 'translateX(-50%)',
        className: 'left-1/2 transform -translate-x-1/2'
      },
      { 
        right: '3rem',
        top: '2400px',
        className: 'right-12'
      },
      { 
        left: '3rem',
        top: '3000px',
        className: 'left-12'
      }
    ]
    return positions[index % positions.length]
  }

  const positionStyles = getPositionStyles()
  const iframeUrl = getFacebookIframeUrl(widget.url)

  return (
    <div
      id={`social-widget-${widget.id}`}
      className={`
        social-widget social-widget-${(index % 5) + 1}
        absolute z-10 transition-all duration-1000 ease-out
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
        {iframeUrl ? (
          <div className="overflow-hidden rounded-lg">
            <iframe
              src={iframeUrl}
              width="267"
              height="476"
              style={{
                border: 'none',
                overflow: 'hidden',
                width: '100%',
                maxWidth: '267px',
                height: '476px'
              }}
              scrolling="no"
              frameBorder="0"
              allowFullScreen={true}
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              title={`Facebook Reel ${widget.position}`}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-96 text-gray-500">
            <div className="text-4xl mb-4">📱</div>
            <p className="text-center text-sm">
              URL de Facebook no válida
            </p>
            <p className="text-center text-xs mt-2 text-gray-400">
              Verifica el formato de la URL
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
        
        {/* Badge de posición */}
        <div className="absolute -top-2 -right-2 bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
          {widget.position}
        </div>
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
      {/* Contenedor con posición relativa para que los widgets se muevan con el scroll */}
      <div className="relative w-full pointer-events-none hidden md:block" style={{ minHeight: '3500px' }}>
        {widgets.map((widget, index) => (
          <div key={widget.id} className="pointer-events-auto">
            <SocialWidgetItem
              widget={widget}
              index={index}
            />
          </div>
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
