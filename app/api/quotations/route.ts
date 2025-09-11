import { NextRequest, NextResponse } from 'next/server'

// Interfaces para las cotizaciones
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
  quotationNumber?: string
  requestId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientCompany?: string
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
  createdAt?: Date
  updatedAt?: Date
  sentAt?: Date
}

// POST - Crear nueva cotización
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar campos requeridos
    const requiredFields = [
      'requestId',
      'clientName',
      'clientEmail',
      'vendorId',
      'items',
      'validUntil'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validar que tenga al menos un item
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'La cotización debe tener al menos un producto' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.clientEmail)) {
      return NextResponse.json(
        { success: false, error: 'Email del cliente inválido' },
        { status: 400 }
      )
    }

    // Generar número de cotización único
    const quotationNumber = `COT-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`

    // Preparar datos para Firestore
    const quotationData: Quotation = {
      quotationNumber,
      requestId: body.requestId,
      clientName: body.clientName,
      clientEmail: body.clientEmail,
      clientPhone: body.clientPhone || '',
      clientCompany: body.clientCompany || '',
      vendorId: body.vendorId,
      vendorName: body.vendorName,
      items: body.items,
      subtotal: body.subtotal || 0,
      discount: body.discount || 0,
      tax: body.tax || 16,
      total: body.total || 0,
      validUntil: body.validUntil,
      notes: body.notes || '',
      terms: body.terms || 'Precios válidos según fecha de vigencia. Entrega sujeta a disponibilidad de inventario.',
      status: body.status || 'borrador',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // En producción, aquí se guardaría en Firestore
    // const result = await createQuotation(quotationData)
    
    // Simular guardado exitoso
    const savedQuotation = {
      ...quotationData,
      id: Date.now().toString()
    }

    // Si la cotización se envía, agregar timestamp
    if (quotationData.status === 'enviada') {
      savedQuotation.sentAt = new Date()
      
      // En producción, aquí se enviaría email al cliente
      // await sendQuotationEmail(savedQuotation)
    }

    return NextResponse.json({
      success: true,
      quotation: savedQuotation,
      message: 'Cotización creada exitosamente'
    })

  } catch (error) {
    console.error('Error in quotations API:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Obtener cotizaciones
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vendorId = searchParams.get('vendorId')
    const requestId = searchParams.get('requestId')
    const status = searchParams.get('status')

    if (!vendorId && !requestId) {
      return NextResponse.json(
        { success: false, error: 'Se requiere vendorId o requestId' },
        { status: 400 }
      )
    }

    // En producción, aquí se consultaría Firestore
    // let result
    // if (vendorId) {
    //   result = await getQuotationsByVendor(vendorId, status)
    // } else if (requestId) {
    //   result = await getQuotationsByRequest(requestId)
    // }

    // Simulación de datos
    const mockQuotations: Quotation[] = []

    return NextResponse.json({
      success: true,
      quotations: mockQuotations
    })

  } catch (error) {
    console.error('Error getting quotations:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar cotización
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { quotationId, updates } = body

    if (!quotationId) {
      return NextResponse.json(
        { success: false, error: 'quotationId es requerido' },
        { status: 400 }
      )
    }

    // Validar campos permitidos para actualización
    const allowedFields = [
      'items',
      'subtotal',
      'discount',
      'tax',
      'total',
      'validUntil',
      'notes',
      'terms',
      'status'
    ]

    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No hay campos válidos para actualizar' },
        { status: 400 }
      )
    }

    // Agregar timestamp de actualización
    filteredUpdates.updatedAt = new Date()

    // Si se cambia a enviada, agregar timestamp
    if (filteredUpdates.status === 'enviada') {
      filteredUpdates.sentAt = new Date()
    }

    // En producción, aquí se actualizaría en Firestore
    // const result = await updateQuotation(quotationId, filteredUpdates)

    return NextResponse.json({
      success: true,
      message: 'Cotización actualizada exitosamente'
    })

  } catch (error) {
    console.error('Error updating quotation:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Eliminar cotización
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const quotationId = searchParams.get('quotationId')

    if (!quotationId) {
      return NextResponse.json(
        { success: false, error: 'quotationId es requerido' },
        { status: 400 }
      )
    }

    // En producción, verificar que la cotización pertenezca al usuario
    // y que esté en estado 'borrador'
    
    // En producción, aquí se eliminaría de Firestore
    // const result = await deleteQuotation(quotationId)

    return NextResponse.json({
      success: true,
      message: 'Cotización eliminada exitosamente'
    })

  } catch (error) {
    console.error('Error deleting quotation:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}