// En lugar de arreglar todo el archivo firestore.ts, 
// vamos a crear funciones wrapper temporales

import { getFirestore } from '@/lib/firebase/utils'
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'

// Funciones críticas para el sistema
export async function createSystemLog(logData: any) {
  try {
    const db = getFirestore()
    const docRef = await addDoc(collection(db, 'systemLogs'), {
      ...logData,
      timestamp: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating system log:', error)
    return { success: false, error }
  }
}

export async function getPendingRequestsByBranch(branchId: string) {
  try {
    const db = getFirestore()
    const q = query(
      collection(db, 'contactRequests'),
      where('branchId', '==', branchId),
      where('status', '==', 'pendiente'),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: requests }
  } catch (error) {
    console.error('Error getting pending requests:', error)
    return { success: false, error }
  }
}
