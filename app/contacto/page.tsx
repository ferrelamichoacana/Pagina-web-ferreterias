import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ContactForm from '@/components/forms/ContactForm'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-16">
        {/* Hero section */}
        <section className="bg-gradient-to-br from-primary-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Solicitar Cotización
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Completa el formulario y un asesor especializado se pondrá en contacto contigo 
              para brindarte la mejor cotización para tu proyecto.
            </p>
          </div>
        </section>

        {/* Formulario de contacto */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm />
          </div>
        </section>

        {/* Información adicional */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Contacto Directo
                </h3>
                <p className="text-gray-600 mb-4">
                  ¿Necesitas ayuda inmediata? Llámanos directamente
                </p>
                <a
                  href="tel:+524431234567"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  (442) 786 0631
                </a>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⏰</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Respuesta Rápida
                </h3>
                <p className="text-gray-600">
                  Nos pondremos en contacto contigo en menos de 24 horas 
                  para brindarte una cotización personalizada.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Asesoría Especializada
                </h3>
                <p className="text-gray-600">
                  Nuestros expertos te ayudarán a elegir los mejores 
                  materiales para tu proyecto específico.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export const metadata = {
  title: 'Contacto y Cotizaciones - Ferretería La Michoacana',
  description: 'Solicita cotizaciones personalizadas para tu proyecto de construcción',
}