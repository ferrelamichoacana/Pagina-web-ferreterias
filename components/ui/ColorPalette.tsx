'use client'

import React from 'react'

export default function ColorPalette() {
  const colors = [
    { name: 'Verde Bosque', class: 'bg-forest-green', hex: '#42542D', description: 'Color principal institucional' },
    { name: 'Verde Claro', class: 'bg-light-green', hex: '#9CB83A', description: 'Color secundario de acento' },
  ]

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        Paleta de Colores Corporativos
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colors.map((color, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className={`${color.class} h-20 w-full rounded-lg mb-3 shadow-inner`}></div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{color.name}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-300 font-mono">{color.hex}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{color.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Ejemplos de Uso:</h4>
        <div className="space-y-2">
          <button className="btn-primary mr-2">Botón Primario</button>
          <button className="btn-secondary mr-2">Botón Secundario</button>
          <button className="btn-accent">Botón de Acento</button>
        </div>
      </div>
    </div>
  )
}