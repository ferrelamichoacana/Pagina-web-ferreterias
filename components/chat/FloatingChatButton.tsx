'use client'

import React, { useState } from 'react'
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import ChatWindow from './ChatWindow'

export default function FloatingChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-200"
          title="¿Necesitas ayuda? Inicia un chat"
        >
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        </button>
        
        {/* Indicador de mensajes nuevos (simulado) */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
      </div>

      {/* Ventana de chat */}
      <ChatWindow
        requestId="general-support"
        requestTitle="Soporte General - Ferretería La Michoacana"
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  )
}