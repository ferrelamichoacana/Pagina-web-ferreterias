'use client'

import React from 'react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { StarIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

export default function TestimonialsSection() {
  const { t } = useLanguage()

  // Testimonios de clientes - Estructura preparada para leer desde Firestore si se desea
  // Por ahora están hardcodeados pero fáciles de editar
  const testimonials = [
    {
      id: 1,
      customerName: 'Salomon Franco',
      companyName: 'Google Maps reviews',
      message: 'Buen surtido',
      rating: 5,
      location: 'Santa Bárbara'
    },
   {
      id: 2,
      customerName: 'María Zetina',
      companyName: 'Google Maps reviews',
      message: 'Excelente atención y encuentro la mayor parte de lo que necesito',
      rating: 5,
      location: 'Santa Bárbara'
    },
    {
      id: 3,
      customerName: 'Bárbara Cruz',
      companyName: 'Google Maps reviews',
      message: 'Excelente servicio y artículos de muy buena calidad',
      rating: 5,
      location: 'Santa Bárbara'
    },
    {
      id: 4,
      customerName: 'Mauricio Torres Ramírez',
      companyName: 'Google Maps reviews',
      message: 'Excelentes precios, con un amplio surtido',
      rating: 5,
      location: 'Santa Bárbara'
    },
    {
      id: 5,
      customerName: 'Miguel ignacio Angel perez',
      companyName: 'Google Maps reviews',
      message: 'Muy buen servicio, y si no lo tienen te orientan eso habla muy bien de ellos',
      rating: 5,
      location: 'Santa Bárbara'
    },
    {
      id: 6,
      customerName: 'Sergio Martell',
      companyName: 'Google Maps reviews',
      message: 'Buen servicio y variedad de productos',
      rating: 5,
      location: 'Santa Bárbara'
    },
    {
      id: 7,
      customerName: 'Vh',
      companyName: 'Google Maps reviews',
      message: 'Excelente servicio, atención y calidad.. 💯…',
      rating: 5,
      location: 'Santa Bárbara'
    },
    {
      id: 8,
      customerName: 'Viridiana Hernandez Aguilar',
      companyName: 'Google Maps reviews',
      message: 'Excelente servicio 100%recomendado',
      rating: 5,
      location: 'Santa Bárbara'
    },
    {
      id: 9,
      customerName: 'Luis Enrique Duran',
      companyName: 'Google Maps reviews',
      message: 'Buen lugar para comprar algunas herramientas',
      rating: 4,
      location: 'Santa Bárbara'
    },
    {
      id: 10,
      customerName: 'Guillermo Chavez Rivera',
      companyName: 'Google Maps reviews',
      message: 'Una ferreteria muy completa precios bajos y la mejor marca Dexter',
      rating: 4,
      location: 'Santa Bárbara'
    }
  ]

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="h-5 w-5 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={star} className="h-5 w-5 text-gray-300" />
          )
        ))}
      </div>
    )
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t.home.testimonialsTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mayor recompensa. 
            Conoce lo que opinan sobre nuestros productos y servicios.
          </p>
        </div>

        {/* Grid de testimonios */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Rating */}
              <div className="flex items-center justify-between mb-4">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-500">{testimonial.location}</span>
              </div>
              
              {/* Mensaje */}
              <blockquote className="text-gray-600 mb-6 italic">
                "{testimonial.message}"
              </blockquote>
              
              {/* Cliente */}
              <div className="border-t border-gray-100 pt-4">
                <div className="font-semibold text-gray-900">
                  {testimonial.customerName}
                </div>
                <div className="text-sm text-primary-600">
                  {testimonial.companyName}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estadísticas de satisfacción */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">98%</div>
              <div className="text-gray-600">Clientes Satisfechos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">1,200+</div>
              <div className="text-gray-600">Reseñas Positivas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">24h</div>
              <div className="text-gray-600">Tiempo de Respuesta</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">8+</div>
              <div className="text-gray-600">Años de Confianza</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}