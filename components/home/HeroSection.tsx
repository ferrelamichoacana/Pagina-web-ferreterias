'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { useSystemConfig } from '@/lib/hooks/useSystemConfig'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export default function HeroSection() {
  const { t } = useLanguage()
  const { config, loading } = useSystemConfig()

  return (
    <section className="relative bg-gradient-corporate section-padding transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Logo principal grande */}
          <div className="flex justify-center mb-8">
            <div className="h-64 w-64 md:h-80 md:w-80 lg:h-96 lg:w-96 flex items-center justify-center">
              <img 
                src="/images/logo.png" 
                alt="Ferretería La Michoacana Logo" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
            </div>
          </div>
          
          {/* Título principal - Dinámico */}
          {loading ? (
            <div className="animate-pulse mb-6">
              <div className="h-12 md:h-16 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            </div>
          ) : (
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
              {config?.heroTitle || t.home.title}
            </h1>
          )}
          
          {/* Eslogan - Dinámico */}
          {loading ? (
            <div className="animate-pulse mb-8">
              <div className="h-6 md:h-8 bg-white bg-opacity-30 rounded w-2/3 mx-auto mb-2"></div>
              <div className="h-6 md:h-8 bg-white bg-opacity-30 rounded w-1/2 mx-auto"></div>
            </div>
          ) : (
            <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto drop-shadow-md">
              {config?.heroSubtitle || t.home.subtitle}
            </p>
          )}
          
          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/contacto"
              className="bg-white text-forest-green px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-lg font-medium flex items-center space-x-2 group shadow-lg"
            >
              <span>{t.home.cta}</span>
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            
            <Link
              href="/sucursales"
              className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-forest-green transition-colors duration-200 text-lg font-medium"
            >
              {t.nav.branches}
            </Link>
          </div>
          
          {/* Estadísticas destacadas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">8+</div>
              <div className="text-gray-200">Años de Experiencia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">2</div>
              <div className="text-gray-200">Sucursales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-200">Clientes Satisfechos</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 bg-primary-300 rounded-full opacity-30"></div>
      </div>
    </section>
  )
}