import { NextRequest, NextResponse } from 'next/server'
import { createJobApplication, getAllJobApplications, getApplicationsByStatus } from '@/lib/utils/firestore'

// POST - Crear nueva aplicación de trabajo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validar campos requeridos
    const requiredFields = [
      'jobId',
      'jobTitle',
      'fullName',
      'email',
      'phone',
      'city',
      'yearsOfExperience',
      'availabilityDate',
      'education',
      'experience',
      'coverLetter',
      'dataConsent',
      'backgroundCheck'
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Campo requerido faltante: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validar consentimientos
    if (!body.dataConsent || !body.backgroundCheck) {
      return NextResponse.json(
        { success: false, error: 'Debes aceptar los consentimientos requeridos' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Validar teléfono (formato básico)
    const phoneRegex = /^[\d\s\-\(\)\+]+$/
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { success: false, error: 'Teléfono inválido' },
        { status: 400 }
      )
    }

    // Generar ID de aplicación único
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Preparar datos para Firestore (siguiendo el tipo JobApplication)
    const applicationData = {
      jobId: body.jobId,
      jobTitle: body.jobTitle,
      branchId: body.branchId || '',
      branchName: body.branchName || '',
      
      // Información personal (campos requeridos por JobApplication)
      applicantName: body.fullName,
      email: body.email, // Campo requerido
      phone: body.phone,
      address: body.address || '',
      city: body.city,
      state: body.state || 'Michoacán',
      
      // Campos requeridos por el tipo JobApplication
      educationLevel: (body.education?.level || 'preparatoria') as 'primaria' | 'secundaria' | 'preparatoria' | 'tecnico' | 'licenciatura' | 'posgrado',
      experience: body.experience || '',
      desiredSalary: body.expectedSalary ? parseInt(body.expectedSalary) : undefined,
      availability: body.availabilityDate || 'Inmediata',
      cvUrl: body.resumeUrl || undefined,
      status: 'nuevo' as const,
      notes: ''
    }

    // Crear aplicación en Firestore
    const result = await createJobApplication(applicationData)

    if (result.success) {
      // En producción, aquí se enviaría email de confirmación
      // await sendApplicationConfirmation(applicationData)
      
      return NextResponse.json({
        success: true,
        applicationId,
        message: 'Aplicación enviada exitosamente'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Error al guardar la aplicación' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error in job applications API:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET - Obtener aplicaciones (para RRHH)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const jobId = searchParams.get('jobId')

    let result

    if (status && status !== 'todas') {
      // Obtener aplicaciones por estado
      result = await getApplicationsByStatus(status as any)
    } else if (jobId) {
      // Obtener aplicaciones por vacante específica
      // Esta función se implementaría en firestore.ts
      result = { success: false, error: 'Not implemented yet' }
    } else {
      // Obtener todas las aplicaciones
      result = await getAllJobApplications()
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        applications: result.data
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error getting job applications:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT - Actualizar estado de aplicación (para RRHH)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, status, notes, hrUserId } = body

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, error: 'applicationId y status son requeridos' },
        { status: 400 }
      )
    }

    // Validar estados permitidos
    const validStatuses = ['nueva', 'revisada', 'entrevista', 'rechazada', 'contratada']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Estado inválido' },
        { status: 400 }
      )
    }

    // Actualizar aplicación
    const result = await updateApplicationStatus(applicationId, status, notes)

    if (result.success) {
      // En producción, aquí se enviaría email de notificación al candidato
      // await sendStatusUpdateNotification(applicationId, status)
      
      return NextResponse.json({
        success: true,
        message: 'Estado actualizado exitosamente'
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error updating application status:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// Función auxiliar para actualizar estado (se movería a firestore.ts)
async function updateApplicationStatus(applicationId: string, status: string, notes?: string) {
  try {
    // Esta función se implementaría en firestore.ts
    console.log('Updating application status:', { applicationId, status, notes })
    return { success: true }
  } catch (error) {
    console.error('Error updating application status:', error)
    return { success: false, error }
  }
}