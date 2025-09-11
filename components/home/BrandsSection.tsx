'use client'

import React from 'react'
import Image from 'next/image'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { useBrands } from '@/lib/hooks/useFirebaseData'

export default function BrandsSection() {
  const { t } = useLanguage()
  const { brands, loading, error } = useBrands()

  if (loading) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t.home.brandsTitle}
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <p className="text-gray-600">No se pudieron cargar las marcas</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t.home.brandsTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Trabajamos con las marcas más reconocidas del mercado para garantizar 
            la calidad y durabilidad de todos nuestros productos.
          </p>
        </div>

        {/* Grid de marcas */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="aspect-square relative mb-4">
                {(brand as any).logoUrl || (brand as any).logo ? (
                  <Image
                    src={(brand as any).logoUrl || (brand as any).logo}
                    alt={`Logo de ${brand.name}`}
                    fill
                    className="object-contain p-2"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 font-semibold text-sm text-center">
                      {brand.name}
                    </span>
                  </div>
                )}
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 mb-1">{brand.name}</h3>
                <p className="text-sm text-gray-500">{brand.category}</p>
                {(brand as any).description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{(brand as any).description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay marcas */}
        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay marcas disponibles en este momento.</p>
          </div>
        )}

        {/* Categorías de productos */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Categorías de Productos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              'Herramientas Eléctricas',
              'Herramientas Manuales', 
              'Material Eléctrico',
              'Plomería',
              'Materiales de Construcción',
              'Ferretería General',
              'Pinturas y Barnices',
              'Tornillería',
              'Seguridad Industrial',
              'Jardinería'
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-sm font-medium text-gray-700">{category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}