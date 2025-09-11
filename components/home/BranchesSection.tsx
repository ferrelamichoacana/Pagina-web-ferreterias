'use client'

import React from 'react'
import { useLanguage } from '@/lib/i18n/LanguageProvider'
import { useBranches } from '@/lib/hooks/useFirebaseData'
import { 
  MapPinIcon, 
  PhoneIcon, 
  ClockIcon,
  ArrowTopRightOnSquareIcon 
} from '@heroicons/react/24/outline'

export default function BranchesSection() {
  const { t } = useLanguage()
  const { branches, loading, error } = useBranches()

  const generateMapsUrl = (address: string, city: string, state: string) => {
    const query = encodeURIComponent(`${address}, ${city}, ${state}, México`)
    return `https://www.google.com/maps/search/?api=1&query=${query}`
  }

  if (loading) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {t.home.branchesTitle}
            </h2>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-red-500 mb-4">⚠️ {error}</div>
          <p className="text-gray-600">No se pudieron cargar las sucursales</p>
        </div>
      </section>
    )
  }

  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {t.home.branchesTitle}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Contamos con sucursales estratégicamente ubicadas para brindarte 
            el mejor servicio en todo Querétaro.
          </p>
        </div>

        {/* Grid de sucursales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className={`card hover:shadow-lg transition-shadow duration-200 ${
                (branch as any).isMain ? 'ring-2 ring-primary-200 bg-primary-50' : ''
              }`}
            >
              {(branch as any).isMain && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-4">
                  Sucursal Principal
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {branch.name}
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-600 text-sm">{branch.address}</p>
                    <p className="text-gray-500 text-sm">{(branch as any).city || 'Morelia'}, {(branch as any).state || 'Michoacán'}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  <a
                    href={`tel:${branch.phone}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    {branch.phone}
                  </a>
                </div>
                
                <div className="flex items-start space-x-3">
                  <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-600 text-sm">{(branch as any).schedule || 'Lun - Sáb: 8:00 AM - 6:00 PM'}</p>
                </div>
              </div>
              
              <div className="mt-6 flex space-x-3">
                <a
                  href={generateMapsUrl(branch.address, (branch as any).city || 'Morelia', (branch as any).state || 'Michoacán')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm flex items-center space-x-2 flex-1 justify-center"
                >
                  <MapPinIcon className="h-4 w-4" />
                  <span>Ver en Mapa</span>
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
                
                <a
                  href={`tel:${branch.phone}`}
                  className="btn-secondary text-sm flex items-center space-x-2 flex-1 justify-center"
                >
                  <PhoneIcon className="h-4 w-4" />
                  <span>Llamar</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}