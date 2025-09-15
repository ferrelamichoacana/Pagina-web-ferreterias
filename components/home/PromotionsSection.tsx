'use client'

import React from 'react'
import PromotionsCarousel from './PromotionsCarousel'
import PromotionModal, { usePromotionModal } from './PromotionModal'
import { usePromotions } from '@/lib/hooks/usePromotions'

export default function PromotionsSection() {
  const { promotions, loading, error } = usePromotions()
  const { selectedPromotion, isModalOpen, openModal, closeModal } = usePromotionModal()

  // No mostrar nada si hay error o está cargando
  if (loading || error || promotions.length === 0) {
    return null
  }

  return (
    <>
      <PromotionsCarousel
        promotions={promotions}
        onPromotionClick={openModal}
        className="w-full"
      />
      
      <PromotionModal
        promotion={selectedPromotion}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  )
}