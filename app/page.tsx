import React from 'react'
import ClientLayout from '@/components/layout/ClientLayout'
import PromotionsSection from '@/components/home/PromotionsSection'
import HeroSection from '@/components/home/HeroSection'
import AboutSection from '@/components/home/AboutSection'
import BrandsSection from '@/components/home/BrandsSection'
import BranchesSection from '@/components/home/BranchesSection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import NewsSection from '@/components/home/NewsSection'
import ReelsSection from '@/components/home/ReelsSection'

export default function HomePage() {
  return (
    <ClientLayout>
      {/* Sección de promociones con carousel */}
      <PromotionsSection />
      
      {/* Sección principal con logo y eslogan */}
      <HeroSection />
      
      {/* ¿Quiénes Somos? */}
      <AboutSection />
      
      {/* Marcas que vendemos */}
      <BrandsSection />
      
      {/* Nuestras Sucursales */}
      <BranchesSection />
      
      {/* Testimonios de clientes */}
      <TestimonialsSection />
      
      {/* Noticias y promociones */}
      <NewsSection />
      
      {/* Sección de reels sociales */}
      <ReelsSection />
    </ClientLayout>
  )
}