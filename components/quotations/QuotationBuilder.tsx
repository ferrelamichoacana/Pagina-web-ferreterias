'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/AuthProvider'
import { 
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  CalculatorIcon,
  PrinterIcon,
  PaperAirplaneIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  TagIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  category: string
  brand: string
  unit: string
  basePrice: number
  stock: number
  description?: string
  image?: string
}

interface QuotationItem {
  id: string
  productId: string
  productName: string
  description: string
  unit: string
  quantity: number
  unitPrice: number
  discount: number
  subtotal: number
}

interface Quotation {
  id?: string
  requestId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  vendorId: string
  vendorName: string
  items: QuotationItem[]
  subtotal: number
  discount: number
  tax: number
  total: number
  validUntil: string
  notes: string
  terms: string
  status: 'borrador' | 'enviada' | 'aceptada' | 'rechazada' | 'vencida'
  createdAt: Date
  updatedAt: Date
}

interface QuotationBuilderProps {
  requestId: string
  clientInfo: {
    name: string
    email: string
    phone: string
    company: string
  }
  isOpen: boolean
  onClose: () => void
  onSave: (quotation: Quotation) => void
  initialData?: Partial<Quotation>
}

export default function QuotationBuilder({
  requestId,
  clientInfo,
  isOpen,
  onClose,
  onSave,
  initialData
}: QuotationBuilderProps) {
  const { user } = useAuth()
  const [quotation, setQuotation] = useState<Quotation>({
    requestId,
    clientName: clientInfo.name,
    clientEmail: clientInfo.email,
    clientPhone: clientInfo.phone,
    vendorId: user?.uid || '',
    vendorName: user?.displayName || '',
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 16, // IVA 16%
    total: 0,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días
    notes: '',
    terms: 'Precios válidos por 30 días. Entrega sujeta a disponibilidad de inventario.',
    status: 'borrador',
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const [products, setProducts] = useState<Product[]>([])
  const [productSearch, setProductSearch] = useState('')
  const [showProductSearch, setShowProductSearch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar productos disponibles (simulado - en producción usar Firebase)
  useEffect(() => {
    const loadProducts = async () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Cemento Portland CPC 30 50kg',
          category: 'Cemento',
          brand: 'CEMEX',
          unit: 'saco',
          basePrice: 185.00,
          stock: 150,
          description: 'Cemento Portland Compuesto CPC 30 de 50kg'
        },
        {
          id: '2',
          name: 'Block hueco 15x20x40cm',
          category: 'Blocks',
          brand: 'Blocktec',
          unit: 'pieza',
          basePrice: 12.50,
          stock: 500,
          description: 'Block hueco de concreto 15x20x40cm'
        },
        {
          id: '3',
          name: 'Varilla corrugada #3 (3/8") 12m',
          category: 'Varilla',
          brand: 'DeAcero',
          unit: 'pieza',
          basePrice: 95.00,
          stock: 80,
          description: 'Varilla corrugada #3 de 3/8" x 12 metros'
        },
        {
          id: '4',
          name: 'Arena de río m³',
          category: 'Agregados',
          brand: 'Local',
          unit: 'm³',
          basePrice: 350.00,
          stock: 25,
          description: 'Arena de río cribada para construcción'
        },
        {
          id: '5',
          name: 'Grava 3/4" m³',
          category: 'Agregados',
          brand: 'Local',
          unit: 'm³',
          basePrice: 380.00,
          stock: 30,
          description: 'Grava triturada 3/4" para concreto'
        }
      ]
      setProducts(mockProducts)
    }

    loadProducts()
  }, [])

  // Aplicar datos iniciales si existen
  useEffect(() => {
    if (initialData) {
      setQuotation(prev => ({ ...prev, ...initialData }))
    }
  }, [initialData])

  // Recalcular totales cuando cambien los items
  useEffect(() => {
    const subtotal = quotation.items.reduce((sum, item) => sum + item.subtotal, 0)
    const discountAmount = (subtotal * quotation.discount) / 100
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * quotation.tax) / 100
    const total = taxableAmount + taxAmount

    setQuotation(prev => ({
      ...prev,
      subtotal,
      total
    }))
  }, [quotation.items, quotation.discount, quotation.tax])

  const addProduct = (product: Product) => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      description: product.description || '',
      unit: product.unit,
      quantity: 1,
      unitPrice: product.basePrice,
      discount: 0,
      subtotal: product.basePrice
    }

    setQuotation(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
    setShowProductSearch(false)
    setProductSearch('')
  }

  const updateItem = (itemId: string, field: keyof QuotationItem, value: any) => {
    setQuotation(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          
          // Recalcular subtotal
          const discountAmount = (updatedItem.unitPrice * updatedItem.discount) / 100
          const priceAfterDiscount = updatedItem.unitPrice - discountAmount
          updatedItem.subtotal = priceAfterDiscount * updatedItem.quantity
          
          return updatedItem
        }
        return item
      })
    }))
  }

  const removeItem = (itemId: string) => {
    setQuotation(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const handleSave = async (status: 'borrador' | 'enviada') => {
    if (quotation.items.length === 0) {
      alert('Agrega al menos un producto a la cotización')
      return
    }

    setIsLoading(true)
    try {
      const quotationToSave = {
        ...quotation,
        status,
        updatedAt: new Date()
      }

      await onSave(quotationToSave)
      onClose()
    } catch (error) {
      console.error('Error saving quotation:', error)
      alert('Error al guardar la cotización')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.brand.toLowerCase().includes(productSearch.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-6xl bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-primary-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalculatorIcon className="h-6 w-6 text-primary-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Crear Cotización
                </h2>
                <p className="text-sm text-gray-600">
                  Cliente: {clientInfo.name} • {clientInfo.company}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del cliente */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Empresa:</strong> {clientInfo.company}</p>
                  <p><strong>Contacto:</strong> {clientInfo.name}</p>
                  <p><strong>Email:</strong> {clientInfo.email}</p>
                  <p><strong>Teléfono:</strong> {clientInfo.phone}</p>
                </div>
              </div>

              {/* Configuración de cotización */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Configuración</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Válida hasta
                    </label>
                    <input
                      type="date"
                      value={quotation.validUntil}
                      onChange={(e) => setQuotation(prev => ({ ...prev, validUntil: e.target.value }))}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descuento General (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={quotation.discount}
                      onChange={(e) => setQuotation(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                      className="input-field text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      IVA (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={quotation.tax}
                      onChange={(e) => setQuotation(prev => ({ ...prev, tax: parseFloat(e.target.value) || 0 }))}
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Productos</h3>
                <button
                  onClick={() => setShowProductSearch(true)}
                  className="btn-primary text-sm inline-flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Agregar Producto
                </button>
              </div>

              {/* Búsqueda de productos */}
              {showProductSearch && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="flex-1 input-field text-sm"
                      autoFocus
                    />
                    <button
                      onClick={() => setShowProductSearch(false)}
                      className="btn-secondary text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {filteredProducts.map(product => (
                      <div
                        key={product.id}
                        onClick={() => addProduct(product)}
                        className="flex items-center justify-between p-3 bg-white rounded border hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.category} • {product.brand}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">${product.basePrice.toLocaleString()}</p>
                          <p className="text-xs text-gray-600">por {product.unit}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabla de productos */}
              {quotation.items.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay productos agregados</p>
                  <p className="text-sm text-gray-500">Haz clic en "Agregar Producto" para comenzar</p>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cant.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Desc. %</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {quotation.items.map(item => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="1"
                                step="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                className="w-20 input-field text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.unitPrice}
                                onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                                className="w-24 input-field text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.1"
                                value={item.discount}
                                onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)}
                                className="w-20 input-field text-sm"
                              />
                            </td>
                            <td className="px-4 py-3">
                              <p className="text-sm font-medium">${item.subtotal.toLocaleString()}</p>
                            </td>
                            <td className="px-4 py-3">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Totales */}
              {quotation.items.length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${quotation.subtotal.toLocaleString()}</span>
                    </div>
                    {quotation.discount > 0 && (
                      <div className="flex justify-between text-sm text-red-600">
                        <span>Descuento ({quotation.discount}%):</span>
                        <span>-${((quotation.subtotal * quotation.discount) / 100).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span>IVA ({quotation.tax}%):</span>
                      <span>${(((quotation.subtotal - (quotation.subtotal * quotation.discount) / 100) * quotation.tax) / 100).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-300 pt-2">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total:</span>
                        <span className="text-primary-600">${quotation.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notas y términos */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas adicionales
                  </label>
                  <textarea
                    value={quotation.notes}
                    onChange={(e) => setQuotation(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="input-field text-sm resize-none"
                    placeholder="Notas especiales para el cliente..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Términos y condiciones
                  </label>
                  <textarea
                    value={quotation.terms}
                    onChange={(e) => setQuotation(prev => ({ ...prev, terms: e.target.value }))}
                    rows={3}
                    className="input-field text-sm resize-none"
                    placeholder="Términos y condiciones de la cotización..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              {quotation.items.length} producto(s) • Total: ${quotation.total.toLocaleString()}
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => handleSave('borrador')}
                disabled={isLoading}
                className="btn-secondary inline-flex items-center"
              >
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Guardar Borrador
              </button>
              
              <button
                onClick={() => handleSave('enviada')}
                disabled={isLoading || quotation.items.length === 0}
                className={`btn-primary inline-flex items-center ${
                  (isLoading || quotation.items.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                {isLoading ? 'Enviando...' : 'Enviar Cotización'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}