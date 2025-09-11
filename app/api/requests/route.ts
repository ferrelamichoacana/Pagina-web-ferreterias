import { NextRequest, NextResponse } from 'next/server'
import { 
  getPendingRequestsByBranch,
  getVendorAssignedRequests,
  getAllRequestsByBranch,
  assignContactRequest,
  updateRequestStatus,
  addVendorNote
} from '@/lib/utils/firestore'

// GET - Obtener solicitudes según el rol y parámetros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'pending', 'assigned', 'all'
    const branchId = searchParams.get('branchId')
    const vendorId = searchParams.get('vendorId')

    if (!type) {
      return NextResponse.json(
        { success: false, error: 'Type parameter is required' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'pending':
        if (!branchId) {
          return NextResponse.json(
            { success: false, error: 'branchId is required for pending requests' },
            { status: 400 }
          )
        }
        result = await getPendingRequestsByBranch(branchId)
        break

      case 'assigned':
        if (!vendorId) {
          return NextResponse.json(
            { success: false, error: 'vendorId is required for assigned requests' },
            { status: 400 }
          )
        }
        result = await getVendorAssignedRequests(vendorId)
        break

      case 'all':
        if (!branchId) {
          return NextResponse.json(
            { success: false, error: 'branchId is required for all requests' },
            { status: 400 }
          )
        }
        result = await getAllRequestsByBranch(branchId)
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid type parameter' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        requests: result.data
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in requests API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Asignar solicitud o actualizar estado
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, requestId, vendorId, managerId, vendorName, status, notes } = body

    if (!action || !requestId) {
      return NextResponse.json(
        { success: false, error: 'Action and requestId are required' },
        { status: 400 }
      )
    }

    let result

    switch (action) {
      case 'assign':
        if (!vendorId || !managerId) {
          return NextResponse.json(
            { success: false, error: 'vendorId and managerId are required for assignment' },
            { status: 400 }
          )
        }
        result = await assignContactRequest(requestId, vendorId, managerId, vendorName)
        break

      case 'updateStatus':
        if (!status) {
          return NextResponse.json(
            { success: false, error: 'status is required for status update' },
            { status: 400 }
          )
        }
        result = await updateRequestStatus(requestId, status, notes)
        break

      case 'addNote':
        if (!vendorId || !notes) {
          return NextResponse.json(
            { success: false, error: 'vendorId and notes are required for adding notes' },
            { status: 400 }
          )
        }
        result = await addVendorNote(requestId, vendorId, notes)
        break

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Operation completed successfully'
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in requests POST API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar solicitud (para vendedores)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, updates } = body

    if (!requestId || !updates) {
      return NextResponse.json(
        { success: false, error: 'requestId and updates are required' },
        { status: 400 }
      )
    }

    // Validar que solo se actualicen campos permitidos
    const allowedFields = ['status', 'priority', 'vendorNotes', 'lastContact']
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Agregar timestamp de actualización
    filteredUpdates.updatedAt = new Date().toISOString()

    // En producción, aquí se actualizaría en Firestore
    console.log('Updating request:', requestId, filteredUpdates)

    return NextResponse.json({
      success: true,
      message: 'Request updated successfully'
    })

  } catch (error) {
    console.error('Error in requests PUT API:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}