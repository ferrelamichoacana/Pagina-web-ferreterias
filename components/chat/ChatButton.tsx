'use client'

import React, { useState } from 'react'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import ChatWindow from './ChatWindow'

interface ChatButtonProps {
  requestId?: string
  requestTitle?: string
  className?: string
}

export default function ChatButton({ 
  requestId = 'general', 
  requestTitle = 'Consulta General',
  className = ''
}: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsChatOpen(true)}
        className={`inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 shadow-lg ${className}`}
        title="Abrir chat de soporte"
      >
        <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
        Chat
      </button>

      <ChatWindow
        requestId={requestId}
        requestTitle={requestTitle}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  )
}