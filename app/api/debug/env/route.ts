import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Solo permitir en desarrollo o para admins
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    // Headers de seguridad básica
    const authHeader = request.headers.get('authorization')
    const isAuthorized = authHeader === 'Bearer debug-admin' || isDevelopment

    if (!isAuthorized) {
      return NextResponse.json({ 
        error: 'Unauthorized - Add Authorization: Bearer debug-admin header' 
      }, { status: 401 })
    }

    // Variables de entorno a verificar
    const envVars = {
      // Firebase Client (Frontend)
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      
      // Firebase Admin (Backend)
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      
      // Otros servicios
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    }

    // Procesar información de las variables
    const envStatus = Object.entries(envVars).map(([key, value]) => {
      const exists = !!value
      const isEmpty = value === ''
      const isDummy = value && (
        value.includes('dummy') || 
        value.startsWith('your_') || 
        value === 'dummy-api-key' ||
        value === 'dummy-project'
      )

      let obfuscatedValue = 'NOT_SET'
      if (exists && !isEmpty) {
        if (key.includes('PRIVATE_KEY')) {
          obfuscatedValue = value.includes('BEGIN PRIVATE KEY') ? 'VALID_PRIVATE_KEY_FORMAT' : 'INVALID_FORMAT'
        } else if (key.includes('EMAIL')) {
          obfuscatedValue = value.includes('@') ? value.replace(/(.{3}).*(@.*)/, '$1***$2') : 'INVALID_EMAIL_FORMAT'
        } else {
          obfuscatedValue = `${value.substring(0, 8)}...${value.substring(value.length - 4)}`
        }
      }

      return {
        key,
        exists,
        isEmpty,
        isDummy,
        valid: exists && !isEmpty && !isDummy,
        obfuscatedValue,
        length: value ? value.length : 0
      }
    })

    // Estadísticas
    const stats = {
      total: envStatus.length,
      valid: envStatus.filter(v => v.valid).length,
      missing: envStatus.filter(v => !v.exists).length,
      dummy: envStatus.filter(v => v.isDummy).length,
      empty: envStatus.filter(v => v.isEmpty).length
    }

    // Información del runtime
    const runtimeInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV || 'not-vercel',
      vercelUrl: process.env.VERCEL_URL || 'not-vercel',
      vercelRegion: process.env.VERCEL_REGION || 'not-vercel',
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    // Test de Firebase Admin
    let firebaseAdminTest = null
    try {
      const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY
      const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL
      const privateKeyFormat = process.env.FIREBASE_PRIVATE_KEY?.includes('BEGIN PRIVATE KEY')
      
      firebaseAdminTest = {
        hasCredentials: hasPrivateKey && hasClientEmail,
        privateKeyFormat,
        canInitialize: hasPrivateKey && hasClientEmail && privateKeyFormat,
        privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
        clientEmailValid: process.env.FIREBASE_CLIENT_EMAIL?.includes('@') || false
      }
    } catch (error: any) {
      firebaseAdminTest = { error: error.message }
    }

    return NextResponse.json({
      success: true,
      runtimeInfo,
      stats,
      firebaseAdminTest,
      envStatus,
      debugInfo: {
        message: 'Variables detected from Vercel runtime',
        allVariablesWorking: stats.valid === stats.total,
        criticalIssues: envStatus.filter(v => !v.valid && (v.key.includes('FIREBASE') || v.key.includes('CLOUDINARY')))
      }
    })

  } catch (error: any) {
    console.error('❌ Debug API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

// Método POST para tests específicos
export async function POST(request: NextRequest) {
  try {
    const { testType } = await request.json()
    
    if (testType === 'firebase-admin') {
      // Test específico de Firebase Admin
      try {
        const admin = await import('firebase-admin')
        
        const serviceAccount = {
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        }

        // Verificar que no esté ya inicializada
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            projectId: serviceAccount.projectId,
          })
        }

        return NextResponse.json({
          success: true,
          message: 'Firebase Admin initialized successfully',
          projectId: serviceAccount.projectId,
          hasPrivateKey: !!serviceAccount.privateKey,
          hasClientEmail: !!serviceAccount.clientEmail
        })

      } catch (error: any) {
        return NextResponse.json({
          success: false,
          error: error.message,
          details: 'Firebase Admin initialization failed'
        })
      }
    }

    return NextResponse.json({ error: 'Invalid test type' }, { status: 400 })

  } catch (error: any) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}
