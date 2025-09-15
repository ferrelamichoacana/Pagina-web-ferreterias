'use client'

import React, { useState, useRef } from 'react'
import { useSocialWidgets } from '@/lib/hooks/useFirebaseData'
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon } from '@heroicons/react/24/outline'

interface ReelItemProps {
  widget: {
    id: string
    type: 'facebook' | 'instagram' | 'reel'
    url: string
    iframeCode?: string
    position: number
    active: boolean
  }
  index: number
}

const ReelItem: React.FC<ReelItemProps> = ({ widget }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Función para obtener el iframe desde el código completo o la URL
  const getIframeContent = () => {
    // Si tiene código iframe completo, usarlo directamente
    if (widget.iframeCode) {
      return widget.iframeCode
    }

    // Si es una URL de Facebook, generar iframe
    if (widget.url && widget.url.includes('facebook.com')) {
      const iframeUrl = getFacebookIframeUrl(widget.url)
      if (iframeUrl) {
        return `<iframe src="${iframeUrl}" width="267" height="476" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`
      }
    }

    return null
  }

  // Función para extraer URL de iframe de Facebook
  const getFacebookIframeUrl = (input: string) => {
    if (!input) return null

    // Si ya es una URL de embed, usarla directamente
    if (input.includes('facebook.com/plugins/video.php')) {
      return input
    }

    // Si es URL de reel, convertir a embed
    const reelMatch = input.match(/facebook\.com\/reel\/(\d+)/)
    if (reelMatch) {
      const reelId = reelMatch[1]
      return `https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(`https://www.facebook.com/reel/${reelId}/`)}&show_text=false&width=267&t=0`
    }

    // Si es URL general de Facebook, intentar convertir
    if (input.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(input)}&show_text=false&width=267&t=0`
    }

    return null
  }

  const iframeContent = getIframeContent()

  return (
    <div className="flex-shrink-0 w-72 mx-2">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Header del reel */}
        <div className="p-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <PlayIcon className="h-5 w-5" />
              <span className="font-medium text-sm">
                {widget.type === 'facebook' ? 'Facebook' : widget.type === 'instagram' ? 'Instagram' : 'Reel'}
              </span>
            </div>
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-bold">
              {widget.position}
            </span>
          </div>
        </div>

        {/* Contenido del reel */}
        <div className="relative">
          {iframeContent ? (
            <div 
              className="w-full"
              dangerouslySetInnerHTML={{ __html: iframeContent }}
              onLoad={() => setIsLoading(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 text-gray-500 p-6">
              <div className="text-4xl mb-4">📱</div>
              <p className="text-center text-sm mb-2">
                Contenido no disponible
              </p>
              <p className="text-center text-xs text-gray-400 mb-4">
                Verifica el formato del contenido
              </p>
              {widget.url && (
                <a 
                  href={widget.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 text-sm underline"
                >
                  Ver original
                </a>
              )}
            </div>
          )}

          {isLoading && iframeContent && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ReelsSection() {
  const { widgets, loading, error } = useSocialWidgets()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Filtrar solo widgets activos y ordenar por posición
  const activeReels = (widgets || [])
    .filter(widget => widget.active)
    .sort((a, b) => a.position - b.position)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      })
    }
  }

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="flex space-x-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-shrink-0 w-72 h-96 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error || !activeReels || activeReels.length === 0) {
    return null
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header de la sección */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Síguenos en Redes Sociales
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubre nuestros reels más recientes con tips, promociones y novedades.
            Desliza para ver más contenido.
          </p>
        </div>

        {/* Container de reels con scroll */}
        <div className="relative">
          {/* Botones de navegación */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-colors duration-200"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>

          {/* Container scrolleable de reels */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scroll-smooth px-12 pb-4 scrollbar-hide"
          >
            {activeReels.map((widget, index) => (
              <ReelItem
                key={widget.id}
                widget={widget}
                index={index}
              />
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
              Síguenos en nuestras redes sociales para ver más contenido exclusivo, 
              promociones y tips de ferretería.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://facebook.com/ferreterialamichoacana"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Facebook</span>
              </a>
              <a
                href="https://instagram.com/ferreterialamichoacana"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Instagram</span>
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
