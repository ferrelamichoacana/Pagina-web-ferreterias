'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { 
  PaperAirplaneIcon, 
  XMarkIcon,
  UserIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface ChatMessage {
  id: string
  requestId: string
  senderId: string
  senderName: string
  senderRole: 'cliente' | 'vendedor' | 'gerente'
  message: string
  timestamp: Date
  read: boolean
}

interface ChatWindowProps {
  requestId: string
  requestTitle: string
  isOpen: boolean
  onClose: () => void
}

export default function ChatWindow({ requestId, requestTitle, isOpen, onClose }: ChatWindowProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll automático al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Cargar mensajes del chat
  useEffect(() => {
    if (isOpen && requestId) {
      loadMessages()
      
      // Simular actualizaciones en tiempo real (en producción usar Firebase listeners)
      const interval = setInterval(loadMessages, 5000)
      return () => clearInterval(interval)
    }
  }, [isOpen, requestId])

  const loadMessages = async () => {
    try {
      // Por ahora simulamos mensajes - en producción usar Firebase
      const mockMessages: ChatMessage[] = [
        {
          id: '1',
          requestId,
          senderId: 'vendor-1',
          senderName: 'Carlos Mendoza',
          senderRole: 'vendedor',
          message: 'Hola! He revisado tu solicitud de cotización. ¿Podrías proporcionarme más detalles sobre las cantidades exactas que necesitas?',
          timestamp: new Date(Date.now() - 3600000),
          read: true
        },
        {
          id: '2',
          requestId,
          senderId: user?.uid || 'client-1',
          senderName: user?.displayName || 'Cliente',
          senderRole: 'cliente',
          message: 'Claro! Necesito aproximadamente 50 sacos de cemento, 200 blocks y varilla del #3 y #4.',
          timestamp: new Date(Date.now() - 1800000),
          read: true
        },
        {
          id: '3',
          requestId,
          senderId: 'vendor-1',
          senderName: 'Carlos Mendoza',
          senderRole: 'vendedor',
          message: 'Perfecto. Te puedo cotizar todo eso. ¿Para cuándo necesitas el material? ¿Requieres servicio de entrega?',
          timestamp: new Date(Date.now() - 900000),
          read: false
        }
      ]
      
      setMessages(mockMessages)
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading messages:', error)
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return

    setIsSending(true)
    
    try {
      const message: ChatMessage = {
        id: Date.now().toString(),
        requestId,
        senderId: user.uid,
        senderName: user.displayName || user.email || 'Usuario',
        senderRole: 'cliente',
        message: newMessage.trim(),
        timestamp: new Date(),
        read: false
      }

      // Agregar mensaje localmente (en producción enviar a Firebase)
      setMessages(prev => [...prev, message])
      setNewMessage('')
      
      // Aquí iría la llamada a la API para guardar en Firebase
      // await createChatMessage(message)
      
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-4 top-4 bottom-4 w-full max-w-md bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header del chat */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-50 rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Chat de Soporte</h3>
              <p className="text-xs text-gray-600 truncate max-w-48">{requestTitle}</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Área de mensajes */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay mensajes aún</p>
              <p className="text-gray-400 text-xs">Inicia la conversación</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === user?.uid
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {message.senderId !== user?.uid && (
                    <div className="flex items-center space-x-2 mb-1">
                      <UserIcon className="h-3 w-3" />
                      <span className="text-xs font-medium">{message.senderName}</span>
                      <span className="text-xs opacity-75">({message.senderRole})</span>
                    </div>
                  )}
                  
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  
                  <p className={`text-xs mt-1 ${
                    message.senderId === user?.uid ? 'text-primary-100' : 'text-gray-500'
                  }`}>
                    {format(message.timestamp, 'HH:mm', { locale: es })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input para nuevo mensaje */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              rows={2}
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={isSending}
            />
            
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isSending}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                newMessage.trim() && !isSending
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <PaperAirplaneIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  )
}