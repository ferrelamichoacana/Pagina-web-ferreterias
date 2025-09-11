'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { useNews } from '@/lib/hooks/useFirebaseData'
import { 
  CalendarDaysIcon, 
  ArrowRightIcon,
  MegaphoneIcon,
  GiftIcon,
  NewspaperIcon 
} from '@heroicons/react/24/outline'

export default function NewsSection() {
  const { t } = useLanguage()
  const { news, loading, error } = useNews()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setMessage('Por favor ingresa tu email')
      setMessageType('error')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage('¡Gracias! Te has suscrito exitosamente al newsletter')
        setMessageType('success')
        setEmail('')
      } else {
        setMessage(result.error || 'Error al suscribirse')
        setMessageType('error')
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setMessage('Error de conexión. Intenta de nuevo.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Datos mock como fallback
  const mockNewsItems = [
    {
      id: '1',
      type: 'noticia',
      title: '¡Celebramos nuestro 8vo Aniversario con nueva página web!',
      description: 'Estamos de fiesta. Ferretería La Michoacana cumple 8 años sirviendo a la comunidad y lo celebramos estrenando nuestra nueva página web con mejor experiencia para nuestros clientes.',
      imageUrl: '/images/8vo-aniversario.jpg',
      date: new Date('2025-09-11'),
      featured: true,
      link: '/noticias/8vo-aniversario-nueva-web',
      active: true,
      createdAt: new Date('2025-09-11'),
      updatedAt: new Date('2025-09-11')
    }
  ]

  // Usar datos de Firebase o fallback a mock
  const newsItems = error || !news?.length ? mockNewsItems : news

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'promocion':
        return GiftIcon
      case 'noticia':
        return NewspaperIcon
      default:
        return MegaphoneIcon
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'promocion':
        return 'bg-accent-100 text-accent-800'
      case 'noticia':
        return 'bg-primary-100 text-primary-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t.home.newsTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Mantente al día con nuestras últimas promociones, noticias y 
            novedades. No te pierdas las mejores ofertas y actualizaciones.
          </p>
        </div>

        {/* Noticia destacada */}
        {newsItems.find(item => item.featured) && (
          <div className="mb-12">
            {(() => {
              const featuredItem = newsItems.find(item => item.featured)!
              const TypeIcon = getTypeIcon(featuredItem.type)
              
              return (
                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl p-8 md:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(featuredItem.type)}`}>
                          <TypeIcon className="h-4 w-4 mr-1" />
                          {featuredItem.type === 'promocion' ? 'Promoción' : 'Noticia'}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <CalendarDaysIcon className="h-4 w-4 mr-1" />
                          {formatDate(featuredItem.date)}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        {featuredItem.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-6 text-lg">
                        {featuredItem.description}
                      </p>
                      
                      {featuredItem.type === 'noticia' && featuredItem.link && (
                        <Link
                          href={featuredItem.link}
                          className="btn-primary inline-flex items-center space-x-2"
                        >
                          <span>Ver Detalles</span>
                          <ArrowRightIcon className="h-5 w-5" />
                        </Link>
                      )}
                    </div>
                    
                    <div className="relative h-64 lg:h-80">
                      {/* Placeholder para imagen destacada */}
                      <div className="w-full h-full bg-gradient-to-br from-primary-200 to-accent-200 rounded-lg flex items-center justify-center">
                        <TypeIcon className="h-16 w-16 text-white opacity-50" />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.filter(item => !item.featured).map((item) => {
            const TypeIcon = getTypeIcon(item.type)
            
            return (
              <article
                key={item.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
              >
                {/* Imagen */}
                <div className="relative h-48">
                  {/* Placeholder para imagen */}
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <TypeIcon className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                
                {/* Contenido */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {item.type === 'promocion' ? 'Promoción' : 'Noticia'}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <CalendarDaysIcon className="h-3 w-3 mr-1" />
                      {formatDate(item.date)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {item.description}
                  </p>
                  
                  {item.type === 'noticia' && item.link && (
                    <Link
                      href={item.link}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm inline-flex items-center space-x-1 group"
                    >
                      <span>Leer más</span>
                      <ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  )}
                </div>
              </article>
            )
          })}
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 bg-primary-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            ¡No te pierdas nuestras promociones!
          </h3>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Suscríbete a nuestro newsletter y recibe las mejores ofertas, 
            noticias y promociones exclusivas directamente en tu correo.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex space-x-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                disabled={isSubmitting}
                required
              />
              <button 
                type="submit"
                className="btn-accent px-6 py-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Suscribirse'}
              </button>
            </div>
            
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                messageType === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}