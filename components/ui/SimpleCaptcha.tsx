'use client'

import React, { useState, useEffect } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void
  className?: string
}

export default function SimpleCaptcha({ onVerify, className = '' }: SimpleCaptchaProps) {
  const [captchaQuestion, setCaptchaQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isVerified, setIsVerified] = useState(false)

  // Generar nueva pregunta de captcha
  const generateCaptcha = () => {
    const operations = [
      { type: 'sum', symbol: '+' },
      { type: 'subtract', symbol: '-' },
      { type: 'multiply', symbol: '×' }
    ]
    
    const operation = operations[Math.floor(Math.random() * operations.length)]
    let num1, num2, answer, question
    
    switch (operation.type) {
      case 'sum':
        num1 = Math.floor(Math.random() * 20) + 1
        num2 = Math.floor(Math.random() * 20) + 1
        answer = num1 + num2
        question = `${num1} ${operation.symbol} ${num2} = ?`
        break
      case 'subtract':
        num1 = Math.floor(Math.random() * 20) + 10
        num2 = Math.floor(Math.random() * 10) + 1
        answer = num1 - num2
        question = `${num1} ${operation.symbol} ${num2} = ?`
        break
      case 'multiply':
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 5) + 1
        answer = num1 * num2
        question = `${num1} ${operation.symbol} ${num2} = ?`
        break
      default:
        num1 = 5
        num2 = 3
        answer = 8
        question = '5 + 3 = ?'
    }
    
    setCaptchaQuestion(question)
    setCorrectAnswer(answer)
    setUserAnswer('')
    setIsVerified(false)
    onVerify(false)
  }

  // Verificar respuesta
  const handleAnswerChange = (value: string) => {
    setUserAnswer(value)
    const numericValue = parseInt(value)
    
    if (!isNaN(numericValue) && numericValue === correctAnswer) {
      setIsVerified(true)
      onVerify(true)
    } else {
      setIsVerified(false)
      onVerify(false)
    }
  }

  // Generar captcha inicial
  useEffect(() => {
    generateCaptcha()
  }, [])

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Verificación Anti-Spam *
      </label>
      
      <div className="flex items-center space-x-3">
        {/* Pregunta del captcha */}
        <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 font-mono text-lg text-center">
          {captchaQuestion}
        </div>
        
        {/* Campo de respuesta */}
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          placeholder="?"
          className={`w-20 px-3 py-3 border rounded-lg text-center font-mono text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
            userAnswer && isVerified 
              ? 'border-green-500 bg-green-50' 
              : userAnswer && !isVerified 
              ? 'border-red-500 bg-red-50' 
              : 'border-gray-300'
          }`}
          required
        />
        
        {/* Botón para regenerar */}
        <button
          type="button"
          onClick={generateCaptcha}
          className="p-3 text-gray-500 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          title="Generar nueva pregunta"
        >
          <ArrowPathIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Indicador de estado */}
      {userAnswer && (
        <div className={`text-sm ${isVerified ? 'text-green-600' : 'text-red-600'}`}>
          {isVerified ? '✓ Verificación correcta' : '✗ Respuesta incorrecta'}
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Resuelve la operación matemática para verificar que no eres un robot
      </p>
    </div>
  )
}