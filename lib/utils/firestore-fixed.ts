// Archivo temporal para reemplazar lib/utils/firestore.ts con solo las funciones esenciales
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
import { getFirestore } from '@/lib/firebase/utils'
import type { 
  User, 
  ContactRequest, 
  JobPosting, 
  JobApplication,
  ChatMessage 
} from '@/types'

// Utilidades para operaciones comunes en Firestore

// Función genérica para crear documentos
export async function createDocument<T>(collectionName: string, data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const db = getFirestore()
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
    const db = getFirestore()
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
    const db = getFirestore()
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

// === FUNCIONES DE USUARIO ===

export async function createUser(userData: Omit<User, 'createdAt' | 'updatedAt'>) {
  return createDocument<User>('users', userData)
}

export async function updateUserRole(userId: string, role: User['role'], branchId?: string) {
  return updateDocument('users', userId, { role, branchId })
}

export async function getUserProfile(userId: string) {
  try {
    const db = getFirestore()
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
    const db = getFirestore()
    await updateDoc(doc(db, 'users', userId), {
      ...profileData,
      updatedAt: serverTimestamp()
    })
    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error }
  }
}

// === FUNCIONES DE SOLICITUDES DE CONTACTO ===

export async function createContactRequest(requestData: Omit<ContactRequest, 'id' | 'createdAt' | 'updatedAt'>) {
  return createDocument<ContactRequest>('contactRequests', requestData)
}

export async function assignContactRequest(requestId: string, vendorId: string, managerId: string, vendorName?: string) {
  return updateDocument('contactRequests', requestId, {
    assignedTo: vendorId,
    assignedBy: managerId,
    vendorName,
    status: 'asignada',
    assignedAt: serverTimestamp()
  })
}

export async function updateRequestStatus(requestId: string, status: ContactRequest['status'], notes?: string) {
  const updateData: any = { status }
  if (notes) updateData.notes = notes
  return updateDocument('contactRequests', requestId, updateData)
}

// === FUNCIONES DE LOGS DEL SISTEMA ===

export async function createSystemLog(logData: {
  action: string
  details: string
  ipAddress?: string
  userAgent?: string
  userId?: string
}) {
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

// === FUNCIONES PARA OBTENER DATOS ===

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

export async function getVendorAssignedRequests(vendorId: string) {
  try {
    const db = getFirestore()
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
    console.error('Error getting vendor requests:', error)
    return { success: false, error }
  }
}

export async function getAllRequestsByBranch(branchId: string) {
  try {
    const db = getFirestore()
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
    console.error('Error getting all requests:', error)
    return { success: false, error }
  }
}

// Funciones básicas para mantener compatibilidad
export async function addVendorNote(requestId: string, vendorId: string, note: string) {
  try {
    const db = getFirestore()
    const requestDoc = await getDoc(doc(db, 'contactRequests', requestId))
    
    if (requestDoc.exists()) {
      const currentNotes = requestDoc.data().vendorNotes || []
      await updateDoc(doc(db, 'contactRequests', requestId), {
        vendorNotes: [
          ...currentNotes,
          {
            note,
            vendorId,
            timestamp: new Date(),
            createdAt: serverTimestamp()
          }
        ],
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

export async function createChatMessage(messageData: Omit<ChatMessage, 'id' | 'timestamp'>) {
  try {
    const db = getFirestore()
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

// Funciones de trabajo básicas
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
    const db = getFirestore()
    const q = query(
      collection(db, 'jobPostings'),
      where('status', '==', 'active'),
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
    const db = getFirestore()
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

// Funciones de aplicaciones de trabajo
export async function createJobApplication(appData: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) {
  return createDocument<JobApplication>('jobApplications', appData)
}

export async function getJobApplicationsByPosting(jobId: string) {
  try {
    const db = getFirestore()
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

// Funciones de búsqueda para diferentes tipos de datos
export async function searchContactRequests(filters: {
  status?: string
  branchId?: string
  dateFrom?: Date
  dateTo?: Date
  companyName?: string
}) {
  try {
    const db = getFirestore()
    let q = query(
      collection(db, 'contactRequests'),
      orderBy('createdAt', 'desc')
    )

    // Aplicar filtros básicos
    if (filters.status) {
      q = query(q, where('status', '==', filters.status))
    }
    if (filters.branchId) {
      q = query(q, where('branchId', '==', filters.branchId))
    }

    const querySnapshot = await getDocs(q)
    let requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Filtros adicionales en memoria
    if (filters.companyName) {
      requests = requests.filter((req: any) => 
        req.companyName?.toLowerCase().includes(filters.companyName!.toLowerCase())
      )
    }

    return { success: true, data: requests }
  } catch (error) {
    console.error('Error searching contact requests:', error)
    return { success: false, error }
  }
}

export async function searchUserRequests(filters: {
  email?: string
  userId?: string
  status?: string
}) {
  try {
    const db = getFirestore()
    let q = query(
      collection(db, 'contactRequests'),
      orderBy('createdAt', 'desc')
    )

    if (filters.email) {
      q = query(q, where('email', '==', filters.email))
    }
    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId))
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status))
    }

    const querySnapshot = await getDocs(q)
    const requests = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return { success: true, data: requests }
  } catch (error) {
    console.error('Error searching user requests:', error)
    return { success: false, error }
  }
}

export async function getChatMessagesByRequest(requestId: string) {
  try {
    const db = getFirestore()
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

export async function getJobApplicationsByUser(userId: string) {
  try {
    const db = getFirestore()
    const q = query(
      collection(db, 'jobApplications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const applications = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: applications }
  } catch (error) {
    console.error('Error getting user job applications:', error)
    return { success: false, error }
  }
}

export async function getITTicketsByUser(userId: string) {
  try {
    const db = getFirestore()
    const q = query(
      collection(db, 'itTickets'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    const tickets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return { success: true, data: tickets }
  } catch (error) {
    console.error('Error getting IT tickets:', error)
    return { success: false, error }
  }
}
