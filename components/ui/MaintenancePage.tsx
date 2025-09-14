'use client'

import React from 'react'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { 
  WrenchScrewdriverIcon,
  ClockIcon,
  HomeIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface MaintenancePageProps {
  title?: string
  message?: string
  showBackButton?: boolean
  backButtonHref?: string
  backButtonLabel?: string
  estimatedTime?: string
  contactInfo?: boolean
}

export default function MaintenancePage({
  title,
  message,
  showBackButton = true,
  backButtonHref = "/",
  backButtonLabel,
  estimatedTime,
  contactInfo = true
}: MaintenancePageProps) {
  const { t, language } = useLanguage()

  // Textos por defecto en ambos idiomas
  const defaultTexts = {
    es: {
      title: 'Página en Mantenimiento',
      message: 'Estamos trabajando para mejorar esta funcionalidad. Pronto estará disponible con nuevas características.',
      backHome: 'Volver al Inicio',
      contact: 'Si necesitas ayuda inmediata, contáctanos:',
      phone: 'Teléfono',
      email: 'Correo',
      estimatedText: 'Tiempo estimado',
      workingOn: 'Trabajando en mejoras...'
    },
    en: {
      title: 'Page Under Maintenance',
      message: 'We are working to improve this functionality. It will be available soon with new features.',
      backHome: 'Back to Home',
      contact: 'If you need immediate help, contact us:',
      phone: 'Phone',
      email: 'Email',
      estimatedText: 'Estimated time',
      workingOn: 'Working on improvements...'
    }
  }

  const texts = defaultTexts[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icono principal animado */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 rounded-full mb-4 relative">
            <WrenchScrewdriverIcon className="w-12 h-12 text-primary-600 animate-pulse" />
            
            {/* Elementos decorativos animados */}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-primary-400 rounded-full animate-ping"></div>
          </div>
          
          {/* Texto "Trabajando en mejoras" */}
          <div className="flex items-center justify-center space-x-2 text-primary-600">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm font-medium">{texts.workingOn}</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {title || texts.title}
        </h1>

        {/* Mensaje principal */}
        <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl mx-auto">
          {message || texts.message}
        </p>

        {/* Tiempo estimado si se proporciona */}
        {estimatedTime && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8 max-w-md mx-auto">
            <div className="flex items-center justify-center space-x-3 text-primary-600">
              <ClockIcon className="w-6 h-6" />
              <div>
                <div className="text-sm font-medium text-gray-500">{texts.estimatedText}</div>
                <div className="text-lg font-semibold">{estimatedTime}</div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          {showBackButton && (
            <Link
              href={backButtonHref}
              className="btn-primary inline-flex items-center space-x-2 px-6 py-3"
            >
              <HomeIcon className="w-5 h-5" />
              <span>{backButtonLabel || texts.backHome}</span>
            </Link>
          )}
          
          <Link
            href="/contacto"
            className="btn-secondary inline-flex items-center space-x-2 px-6 py-3"
          >
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>Contactar Soporte</span>
          </Link>
        </div>

        {/* Información de contacto */}
        {contactInfo && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-lg mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {texts.contact}
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-center space-x-3">
                <span className="font-medium text-gray-500 w-16 text-left">{texts.phone}:</span>
                <a 
                  href="tel:+524431234567" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  (443) 123-4567
                </a>
              </div>
              
              <div className="flex items-center justify-center space-x-3">
                <span className="font-medium text-gray-500 w-16 text-left">{texts.email}:</span>
                <a 
                  href="mailto:soporte@ferreterialamichoacana.com" 
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  soporte@ferreterialamichoacana.com
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Footer con créditos */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-400">
            © 2024 Ferretería La Michoacana - Desarrollado por{' '}
            <a 
              href="mailto:atencionaclientes@dinoraptor.tech" 
              className="text-primary-500 hover:text-primary-600"
            >
              DINOS Tech
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}