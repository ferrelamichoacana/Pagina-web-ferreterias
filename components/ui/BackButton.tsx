'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

interface BackButtonProps {
  href: string
  label?: string
  className?: string
}

export default function BackButton({ 
  href, 
  label = 'Regresar', 
  className = '' 
}: BackButtonProps) {
  return (
    <Link 
      href={href}
      className={`
        inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
        text-gray-700 bg-white border border-gray-300 rounded-lg 
        hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
        ${className}
      `}
    >
      <ArrowLeftIcon className="w-4 h-4" />
      {label}
    </Link>
  )
}
