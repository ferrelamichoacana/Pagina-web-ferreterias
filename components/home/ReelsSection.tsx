'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline'

interface SocialWidget {
  id: string
  type: 'facebook' | 'instagram' | 'reel'
  url: string
  iframeCode?: string
  position: number
  active: boolean
}

interface ReelItemProps {
  widget: SocialWidget
  index: number
}

const ReelItem: React.FC<ReelItemProps> = ({ widget }) => {
  // Función para generar iframe de Facebook
  const getFacebookIframeUrl = (url: string) => {
    if (!url) return null
    
    // Si es URL de reel, convertir a embed
    const reelMatch = url.match(/facebook\.com\/reel\/(\d+)/)
    if (reelMatch) {
      const reelId = reelMatch[1]
      return `https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(`https://www.facebook.com/reel/${reelId}/`)}&show_text=false&width=267&t=0`
    }
    
    return null
  }

  const iframeUrl = getFacebookIframeUrl(widget.url)

  return (
    <div className="flex-shrink-0 w-72 mx-2">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlayIcon className="h-5 w-5" />
              <span className="font-medium text-sm">Facebook Reel</span>
            </div>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
              {widget.position}
            </span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          {iframeUrl ? (
            <div className="w-full">
              <iframe
                src={iframeUrl}
                width="267"
                height="476"
                style={{ border: 'none', overflow: 'hidden', width: '100%' }}
                scrolling="no"
                frameBorder="0"
                allowFullScreen={true}
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <div className="text-4xl mb-4">📱</div>
              <p className="text-center text-sm">No se pudo cargar el reel</p>
              <a 
                href={widget.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-700 text-sm underline mt-2"
              >
                Ver en Facebook
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReelsSection() {
  const [widgets, setWidgets] = useState<SocialWidget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await fetch('/api/social-widgets')
        const data = await response.json()
        
        if (data.success) {
          setWidgets(data.widgets || [])
        } else {
          setError(data.error || 'Error desconocido')
        }
      } catch (err) {
        setError(`Error: ${err instanceof Error ? err.message : 'Error de conexión'}`)
      } finally {
        setLoading(false)
      }
    }

    fetchWidgets()
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Síguenos en Redes Sociales</h2>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-72 h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Síguenos en Redes Sociales</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">Error al cargar reels: {error}</p>
          </div>
        </div>
      </section>
    )
  }

  if (!widgets || widgets.length === 0) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Síguenos en Redes Sociales</h2>
          <p className="text-gray-600">No hay reels disponibles en este momento.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Síguenos en Redes Sociales
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestros reels más recientes con tips, promociones y novedades.
          </p>
        </div>

        {/* Container de reels */}
        <div className="relative">
          {/* Botones de navegación */}
          {widgets.length > 1 && (
            <>
              <button
                onClick={scrollLeft}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
              >
                <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
              </button>

              <button
                onClick={scrollRight}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50"
              >
                <ChevronRightIcon className="h-6 w-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Reels container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth px-12 pb-4 scrollbar-hide"
          >
            {widgets.map((widget, index) => (
              <ReelItem key={widget.id} widget={widget} index={index} />
            ))}
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 text-white">
            <h3 className="text-xl md:text-2xl font-bold mb-4">
              ¡No te pierdas nuestro contenido!
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              Síguenos en nuestras redes sociales para más contenido exclusivo.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://facebook.com/ferreterialamichoacana"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
              >
                Facebook
              </a>
              <a
                href="https://instagram.com/ferreterialamichoacana"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}
