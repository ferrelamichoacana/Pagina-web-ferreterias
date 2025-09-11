import React from 'react'
import { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HRContactForm from '@/components/forms/HRContactForm'

export const metadata: Metadata = {
  title: 'Contactar RRHH - Ferretería La Michoacana',
  description: 'Ponte en contacto con nuestro departamento de Recursos Humanos',
}

export default function ContactHRPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Contactar Recursos Humanos
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              ¿Tienes preguntas sobre nuestras vacantes o el proceso de selección? 
              Nuestro equipo de RRHH está aquí para ayudarte.
            </p>
          </div>

          {/* Información de contacto directo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-3">
                Contacto Directo RRHH
              </h2>
              <div className="space-y-3 text-blue-800">
                <div className="flex items-center">
                  <span className="font-medium">Email:</span>
                  <span className="ml-2">rrhh@ferreterialamichoacana.com</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Teléfono:</span>
                  <span className="ml-2">(443) 123-4567 ext. 102</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">Horario:</span>
                  <span className="ml-2">Lun-Vie 9:00-17:00</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-green-900 mb-3">
                ¿En qué podemos ayudarte?
              </h2>
              <ul className="space-y-2 text-green-800 text-sm">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Información sobre vacantes disponibles
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Estado de tu aplicación
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Proceso de selección y entrevistas
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Beneficios y condiciones laborales
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  Oportunidades de crecimiento
                </li>
              </ul>
            </div>
          </div>

          {/* Formulario de contacto */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Enviar Mensaje a RRHH
            </h2>
            <HRContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}