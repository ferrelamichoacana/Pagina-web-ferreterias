import React from 'react'
import { Metadata } from 'next'
import ProfileEditor from '@/components/user/ProfileEditor'

export const metadata: Metadata = {
  title: 'Editar Perfil - Ferretería La Michoacana',
  description: 'Actualiza tu información personal y de contacto',
}

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileEditor />
      </div>
    </main>
  )
}