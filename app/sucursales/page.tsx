import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BranchesSection from '@/components/home/BranchesSection'

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-16">
        {/* Hero section para sucursales */}
        <section className="bg-gradient-to-br from-primary-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nuestras Sucursales
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra la sucursal más cercana a ti. Estamos presentes en múltiples 
              estados para brindarte el mejor servicio y atención personalizada.
            </p>
          </div>
        </section>

        {/* Sección de sucursales reutilizada */}
        <BranchesSection />
        
        {/* Mapa placeholder - Se implementará cuando tengamos Google Maps API */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
              Ubicaciones en el Mapa
            </h3>
            <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg h-96 flex items-center justify-center shadow-lg">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Mapa Interactivo Próximamente
                </h4>
                <p className="text-gray-600 mb-4">
                  Estamos preparando un mapa interactivo para que puedas ubicar fácilmente 
                  nuestras sucursales y obtener direcciones.
                </p>
                <p className="text-sm text-gray-500">
                  Mientras tanto, puedes usar los enlaces "Ver en Mapa" de cada sucursal arriba
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Información adicional */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🏪</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Atención Personalizada
                </h3>
                <p className="text-gray-600">
                  Cada sucursal cuenta con personal especializado para asesorarte 
                  en tu proyecto específico.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Entrega a Domicilio
                </h3>
                <p className="text-gray-600">
                  Servicio de entrega disponible en todas nuestras sucursales 
                  para tu comodidad.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💼</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ventas Mayoristas
                </h3>
                <p className="text-gray-600">
                  Precios especiales para constructores, contratistas y 
                  distribuidores autorizados.
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
  title: 'Sucursales - Ferretería La Michoacana',
  description: 'Encuentra la sucursal más cercana.',
}