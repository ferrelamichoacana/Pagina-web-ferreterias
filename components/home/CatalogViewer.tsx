'use client'

import React, { useState } from 'react'

interface CatalogViewerProps {
  catalogs: string[]
  brandName: string
  onClose: () => void
}

export default function CatalogViewer({ catalogs, brandName, onClose }: CatalogViewerProps) {
  const [selectedCatalog, setSelectedCatalog] = useState(catalogs[0])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-7xl w-full h-[90vh] flex flex-col">
        {/* Header */}
        <div className="border-b p-4 flex items-center justify-between bg-white">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              Catálogos de {brandName}
            </h2>
            {catalogs.length > 1 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {catalogs.map((catalog) => (
                  <button
                    key={catalog}
                    onClick={() => setSelectedCatalog(catalog)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      selectedCatalog === catalog
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {catalog.replace('.pdf', '').replace(/^catalogo\s*/i, '')}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 text-gray-500 hover:text-gray-700 text-2xl font-bold leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>

        {/* PDF Viewer usando iframe */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <iframe
            src={`/catalogos/${selectedCatalog}#view=FitH`}
            className="w-full h-full border-0"
            title={`Catálogo ${selectedCatalog}`}
          />
        </div>

        {/* Footer con botón de descarga */}
        <div className="border-t p-3 flex justify-center bg-gray-50 gap-4">
          <a
            href={`/catalogos/${selectedCatalog}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Abrir en nueva pestaña
          </a>
          <a
            href={`/catalogos/${selectedCatalog}`}
            download
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Descargar PDF
          </a>
        </div>
      </div>
    </div>
  )
}
