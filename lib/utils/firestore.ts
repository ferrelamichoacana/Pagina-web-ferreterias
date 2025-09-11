import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore'
import { db } from '@/lib/firebase/config'
import type { 
  User, 
  ContactRequest, 
  JobPosting, 
  JobApplication, 
  ITTicket, 
  ChatMessage,
  SystemLog 
} from '@/types'

// Utilidades para operaciones comunes en Firestore

// Función genérica para crear documentos
export async function createDocument<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    return { success: false, error }
  }
}

// Función genérica para actualizar documentos
export async function updateDocument(collectionName: string, docId: string, data: Partial<any>) {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    return { success: false, error }
  }
}

// Función genérica para obtener un documento
export async function getDocument(collectionName: string, docId: string) {
  try {
    const docSnap = await getDoc(doc(db, collectionName, docId))
    if (docSnap.exists()) {
      return { 
        success: true, 
        data: { id: docSnap.id, ...docSnap.data() } 
      }
    } else {
      return { success: false, error: 'Document not found' }
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    return { success: false, error }
  }
}

// Funciones específicas para cada colección

// Usuarios
export async function createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>) {
  return createDocument<User>('users', userData)
}

export async function updateUserRole(userId: string, role: User['role'], branchId?: string) {
  return updateDocument('users', userId, { role, branchId })
}

export async function getUserProfile(userId: string) {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId))
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting user profile:', error)
    throw error
  }
}

export async function updateUserProfile(userId: string, profileData: Partial<User>) {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    throw error
  }
}

// Solicitudes de contacto
export async function createContactRequest(requestData: Omit<ContactRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  return createDocument<ContactRequest>('contactRequests', requestData)
}

export async function assignContactRequest(requestId: string, vendorId: string, managerId: string, vendorName?: string) {
  return updateDocument('contactRequests', requestId, {
    status: 'asignada',
    assignedTo: vendorId,
    assignedBy: managerId,
    assignedToName: vendorName,
    assignedAt: serverTimestamp()
  })
}

export async function updateRequestStatus(requestId: string, status: ContactRequest['status'], notes?: string) {
  const updateData: any = { status, lastUpdated: serverTimestamp() }
  if (notes) {
    updateData.lastStatusNote = notes
  }
  return updateDocument('contactRequests', requestId, updateData)
}

// Obtener solicitudes pendientes por sucursal (para gerentes)
export async function getPendingRequestsByBranch(branchId: string) {
  try {
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
    console.error('Error getting pending requests by branch:', error)
    return { success: false, error }
  }
}

// Obtener solicitudes asignadas a un vendedor
export async function getVendorAssignedRequests(vendorId: string) {
  try {
    const q = query(
      collection(db, 'contactRequests'),
      where('assignedTo', '==', vendorId),
      where('status', 'in', ['asignada', 'en_proceso']),
      orderBy('assignedAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: requests }
  } catch (error) {
    console.error('Error getting vendor assigned requests:', error)
    return { success: false, error }
  }
}

// Obtener todas las solicitudes de una sucursal (para gerentes)
export async function getAllRequestsByBranch(branchId: string) {
  try {
    const q = query(
      collection(db, 'contactRequests'),
      where('branchId', '==', branchId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: requests }
  } catch (error) {
    console.error('Error getting all requests by branch:', error)
    return { success: false, error }
  }
}

// Agregar nota de vendedor a solicitud
export async function addVendorNote(requestId: string, vendorId: string, note: string) {
  try {
    const requestDoc = await getDoc(doc(db, 'contactRequests', requestId))
    if (requestDoc.exists()) {
      const currentData = requestDoc.data()
      const vendorNotes = currentData.vendorNotes || []
      const newNote = {
        vendorId,
        note,
        timestamp: new Date().toISOString()
      }
      
      await updateDoc(doc(db, 'contactRequests', requestId), {
        vendorNotes: [...vendorNotes, newNote],
        lastContact: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      return { success: true }
    }
    return { success: false, error: 'Request not found' }
  } catch (error) {
    console.error('Error adding vendor note:', error)
    return { success: false, error }
  }
}

// Mensajes de chat
export async function createChatMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp'>) {
  try {
    const docRef = await addDoc(collection(db, 'chatMessages'), {
      ...messageData,
      timestamp: serverTimestamp(),
      read: false
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error('Error creating chat message:', error)
    return { success: false, error }
  }
}

export async function markMessageAsRead(messageId: string) {
  return updateDocument('chatMessages', messageId, { read: true })
}

// Vacantes de empleo
export async function createJobPosting(jobData: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt'>) {
  return createDocument<JobPosting>('jobPostings', jobData)
}

export async function updateJobPosting(jobId: string, jobData: Partial<JobPosting>) {
  return updateDocument('jobPostings', jobId, jobData)
}

export async function updateJobStatus(jobId: string, status: JobPosting['status']) {
  return updateDocument('jobPostings', jobId, { status })
}

export async function getActiveJobPostings() {
  try {
    const q = query(
      collection(db, 'jobPostings'),
      where('status', '==', 'activa'),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const jobs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: jobs }
  } catch (error) {
    console.error('Error getting active job postings:', error)
    return { success: false, error }
  }
}

export async function getAllJobPostings() {
  try {
    const q = query(
      collection(db, 'jobPostings'),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const jobs = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: jobs }
  } catch (error) {
    console.error('Error getting all job postings:', error)
    return { success: false, error }
  }
}

// Aplicaciones de trabajo
export async function createJobApplication(applicationData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
  return createDocument<JobApplication>('jobApplications', applicationData)
}

export async function updateApplicationStatus(applicationId: string, status: JobApplication['status'], notes?: string) {
  const updateData: any = { status }
  if (notes) {
    // Agregar nota al array existente
    const currentApp = await getDocument('jobApplications', applicationId)
    if (currentApp.success && currentApp.data) {
      const existingNotes = (currentApp.data as any).notes || []
      updateData.notes = [...existingNotes, `${new Date().toISOString()}: ${notes}`]
    }
  }
  return updateDocument('jobApplications', applicationId, updateData)
}

export async function getAllJobApplications() {
  try {
    const q = query(
      collection(db, 'jobApplications'),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: applications }
  } catch (error) {
    console.error('Error getting all job applications:', error)
    return { success: false, error }
  }
}

export async function getApplicationsByStatus(status: JobApplication['status']) {
  try {
    const q = query(
      collection(db, 'jobApplications'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: applications }
  } catch (error) {
    console.error('Error getting applications by status:', error)
    return { success: false, error }
  }
}

// Tickets IT
export async function createITTicket(ticketData: Omit<ITTicket, 'id' | 'createdAt' | 'updatedAt'>) {
  return createDocument<ITTicket>('itTickets', ticketData)
}

export async function assignITTicket(ticketId: string, assignedTo: string, assignedToName: string) {
  return updateDocument('itTickets', ticketId, {
    status: 'en_proceso',
    assignedTo,
    assignedToName
  })
}

export async function updateTicketStatus(ticketId: string, status: ITTicket['status'], resolutionNotes?: string) {
  const updateData: any = { status }
  if (resolutionNotes) updateData.resolutionNotes = resolutionNotes
  return updateDocument('itTickets', ticketId, updateData)
}

// Logs del sistema
export async function createSystemLog(logData: Omit<SystemLog, 'id' | 'timestamp'>) {
  try {
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

// Funciones de consulta

// Obtener solicitudes por usuario
export async function getUserContactRequests(userId: string) {
  try {
    const q = query(
      collection(db, 'contactRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: requests }
  } catch (error) {
    console.error('Error getting user contact requests:', error)
    return { success: false, error }
  }
}

// Obtener solicitudes por vendedor
export async function getVendorContactRequests(vendorId: string) {
  try {
    const q = query(
      collection(db, 'contactRequests'),
      where('assignedTo', '==', vendorId),
      where('status', 'in', ['asignada', 'en_proceso']),
      orderBy('updatedAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: requests }
  } catch (error) {
    console.error('Error getting vendor contact requests:', error)
    return { success: false, error }
  }
}

// Obtener mensajes de chat por solicitud
export async function getChatMessages(requestId: string) {
  try {
    const q = query(
      collection(db, 'chatMessages'),
      where('requestId', '==', requestId),
      orderBy('timestamp', 'asc')
    )
    const querySnapshot = await getDocs(q)
    const messages = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: messages }
  } catch (error) {
    console.error('Error getting chat messages:', error)
    return { success: false, error }
  }
}

// Obtener aplicaciones por vacante
export async function getJobApplications(jobId: string) {
  try {
    const q = query(
      collection(db, 'jobApplications'),
      where('jobId', '==', jobId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: applications }
  } catch (error) {
    console.error('Error getting job applications:', error)
    return { success: false, error }
  }
}

// Obtener tickets IT por sucursal
export async function getITTicketsByBranch(branchId: string) {
  try {
    const q = query(
      collection(db, 'itTickets'),
      where('branchId', '==', branchId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: tickets }
  } catch (error) {
    console.error('Error getting IT tickets by branch:', error)
    return { success: false, error }
  }
}

// Utilidad para convertir timestamps de Firestore
export function convertTimestamp(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate()
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000)
  }
  return new Date(timestamp)
}