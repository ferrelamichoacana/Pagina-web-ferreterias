import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center px-4">
      <div className="text-center">
        {/* Logo gigante */}
        <div className="flex justify-center mb-8">
          <div className="h-48 w-48 md:h-64 md:w-64 lg:h-80 lg:w-80 flex items-center justify-center">
            <img 
              src="/images/logo.png" 
              alt="Ferretería La Michoacana Logo" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Mensaje de mantenimiento */}
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Página en Mantenimiento
          </h2>
          
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            La página que buscas está temporalmente en mantenimiento. 
            Nuestro equipo técnico está trabajando para mejorar tu experiencia.
          </p>

          <div className="space-y-4">
            <p className="text-gray-500 text-sm">
              Disculpa las molestias. Estaremos de vuelta pronto.
            </p>
            
            {/* Botón de regresar */}
            <Link
              href="/"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Regresar al Inicio</span>
            </Link>
          </div>

          {/* Información de contacto */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-2">
              ¿Necesitas ayuda inmediata?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a 
                href="tel:+524431234567" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                📞 (442) 786 0631
              </a>
              <a 
                href="mailto:contacto@ferreterialamichoacana.com" 
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                ✉️ contacto@ferrelamichoacana.com
              </a>
            </div>
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-accent-300 rounded-full opacity-30 animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}