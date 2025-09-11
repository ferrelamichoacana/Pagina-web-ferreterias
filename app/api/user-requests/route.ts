import { NextRequest, NextResponse } from 'next/server'
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase/config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const userId = searchParams.get('userId')

    if (!email && !userId) {
      return NextResponse.json(
        { success: false, error: 'Email o userId requerido' },
        { status: 400 }
      )
    }

    // Crear query para obtener solicitudes del usuario
    let q
    if (userId) {
      q = query(
        collection(db, 'contactRequests'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      )
    } else {
      q = query(
        collection(db, 'contactRequests'),
        where('email', '==', email),
        orderBy('createdAt', 'desc')
      )
    }

    const querySnapshot = await getDocs(q)
    const requests = querySnapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      }
    })

    return NextResponse.json({
      success: true,
      requests,
      count: requests.length
    })

  } catch (error) {
    console.error('Error fetching user requests:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error interno del servidor' 
      },
      { status: 500 }
    )
  }
}