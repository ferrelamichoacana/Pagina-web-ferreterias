import { NextRequest, NextResponse } from 'next/server'
import { getFirestore } from '@/lib/firebase/utils'
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc, orderBy, query } from 'firebase/firestore'
import type { SocialWidget } from '@/types'

export async function GET() {
  try {
    const db = getFirestore()
    const q = query(collection(db, 'socialWidgets'), orderBy('position'))
    const snapshot = await getDocs(q)
    
    const widgets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    })) as SocialWidget[]

    return NextResponse.json({
      success: true,
      widgets: widgets.filter(w => w.active),
      total: widgets.length
    })
  } catch (error) {
    console.error('Error fetching social widgets:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, url, iframeCode, position, active = true } = await request.json()

    if (!type || position === undefined) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos (type, position)' },
        { status: 400 }
      )
    }

    // Validar que tenga URL o iframeCode según el tipo
    if (type === 'reel' && !iframeCode) {
      return NextResponse.json(
        { success: false, error: 'El código iframe es requerido para tipo "reel"' },
        { status: 400 }
      )
    }

    if ((type === 'facebook' || type === 'instagram') && !url) {
      return NextResponse.json(
        { success: false, error: 'La URL es requerida para tipos "facebook" e "instagram"' },
        { status: 400 }
      )
    }

    const db = getFirestore()
    const newWidget = {
      type,
      url: url || '',
      iframeCode: iframeCode || '',
      position,
      active,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const docRef = await addDoc(collection(db, 'socialWidgets'), newWidget)

    return NextResponse.json({
      success: true,
      widget: { id: docRef.id, ...newWidget },
      message: 'Reel creado exitosamente'
    })
  } catch (error) {
    console.error('Error creating social widget:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del widget requerido' },
        { status: 400 }
      )
    }

    const { type, url, iframeCode, position, active } = await request.json()
    
    const db = getFirestore()
    const updateData: any = {
      updatedAt: new Date()
    }

    if (type !== undefined) updateData.type = type
    if (url !== undefined) updateData.url = url
    if (iframeCode !== undefined) updateData.iframeCode = iframeCode
    if (position !== undefined) updateData.position = position
    if (active !== undefined) updateData.active = active

    await updateDoc(doc(db, 'socialWidgets', id), updateData)

    return NextResponse.json({
      success: true,
      message: 'Reel actualizado exitosamente'
    })
  } catch (error) {
    console.error('Error updating social widget:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del widget requerido' },
        { status: 400 }
      )
    }

    const db = getFirestore()
    await deleteDoc(doc(db, 'socialWidgets', id))

    return NextResponse.json({
      success: true,
      message: 'Reel eliminado exitosamente'
    })
  } catch (error) {
    console.error('Error deleting social widget:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
