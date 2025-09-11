'use client'

import React from 'react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { useSystemConfig } from '@/lib/hooks/useSystemConfig'
import { 
  BuildingStorefrontIcon,
  UserGroupIcon,
  TruckIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'

export default function AboutSection() {
  const { t } = useLanguage()
  const { config, loading } = useSystemConfig()

  const features = [
    {
      icon: BuildingStorefrontIcon,
      title: 'Sucursales Equipadas',
      description: 'Con stock siempre disponible'
    },
    {
      icon: UserGroupIcon,
      title: 'Atención Personalizada',
      description: 'Equipo de expertos para asesorarte en tu proyecto'
    },
    {
      icon: TruckIcon,
      title: 'Entrega Rápida',
      description: 'Servicio de entrega eficiente en toda la región'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Calidad Garantizada',
      description: 'Solo trabajamos con las mejores marcas del mercado'
    }
  ]

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {config?.content?.aboutTitle || t.home.aboutTitle}
          </h2>
          
          {/* Texto dinámico desde Firebase o fallback a traducción */}
          <div className="max-w-4xl mx-auto">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
              </div>
            ) : (
              <p className="text-lg text-gray-600 leading-relaxed">
                {config?.content?.aboutDescription || t.home.aboutText}
              </p>
            )}
          </div>
        </div>

        {/* Características destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                <feature.icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Valores de la empresa - Contenido dinámico */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">Misión</h3>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
                </div>
              ) : (
                <p className="text-gray-600">
                  {'Proveer materiales de construcción y herramientas de la más alta calidad, con un servicio excepcional que supere las expectativas de nuestros clientes.'}
                </p>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">Visión</h3>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
                </div>
              ) : (
                <p className="text-gray-600">
                  {'Ser la ferretería líder en México, reconocida por nuestra excelencia en servicio, calidad de productos y compromiso con el desarrollo de nuestras comunidades.'}
                </p>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-2xl font-bold text-primary-600 mb-4">Valores</h3>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6 mx-auto"></div>
                </div>
              ) : (
                <p className="text-gray-600">
                  {'Honestidad, calidad, servicio al cliente, responsabilidad social y compromiso con el crecimiento sostenible de nuestro país.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}