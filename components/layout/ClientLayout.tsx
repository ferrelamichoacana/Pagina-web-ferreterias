'use client'

import React from 'react'
import Header from './Header'
import Footer from './Footer'


interface ClientLayoutProps {
  children: React.ReactNode
  showChat?: boolean
}

export default function ClientLayout({ children, showChat = true }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {children}
      </main>
      
      <Footer />
      

    </div>
  )
}