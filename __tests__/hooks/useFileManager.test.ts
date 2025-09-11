import { renderHook, act, waitFor } from '@testing-library/react'
import { useFileManager } from '@/lib/hooks/useFileManager'

// Mock Firebase
jest.mock('@/lib/firebase', () => ({
  db: {}
}))

// Mock Firestore functions
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  onSnapshot: jest.fn(),
  orderBy: jest.fn(),
  updateDoc: jest.fn()
}))

const mockFirestore = require('firebase/firestore')

describe('useFileManager', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useFileManager())
    
    expect(result.current.files).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('saves file record correctly', async () => {
    const mockDocRef = { id: 'test-file-id' }
    mockFirestore.addDoc.mockResolvedValueOnce(mockDocRef)
    
    const { result } = renderHook(() => useFileManager({ userId: 'test-user' }))
    
    const fileData = {
      name: 'test.pdf',
      size: 1024,
      type: 'application/pdf',
      url: 'https://example.com/test.pdf',
      cloudinaryId: 'test_id',
      category: 'document' as const,
      uploadedAt: new Date(),
      uploadedBy: 'test-user'
    }
    
    let savedFile
    await act(async () => {
      savedFile = await result.current.saveFileRecord(fileData)
    })
    
    expect(mockFirestore.addDoc).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        ...fileData,
        uploadedBy: 'test-user'
      })
    )
    
    expect(savedFile).toEqual(
      expect.objectContaining({
        id: 'test-file-id',
        ...fileData
      })
    )
  })

  it('handles file deletion correctly', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    })
    
    const { result } = renderHook(() => useFileManager())
    
    let deleteResult
    await act(async () => {
      deleteResult = await result.current.deleteFile('file-id', 'cloudinary-id')
    })
    
    expect(global.fetch).toHaveBeenCalledWith('/api/files/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cloudinaryId: 'cloudinary-id' })
    })
    
    expect(mockFirestore.deleteDoc).toHaveBeenCalled()
    expect(deleteResult).toBe(true)
  })

  it('handles upload errors gracefully', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Upload failed'))
    
    const { result } = renderHook(() => useFileManager())
    
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' })
    
    await act(async () => {
      try {
        await result.current.uploadFiles([file])
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
      }
    })
    
    expect(result.current.error).toBeTruthy()
  })

  it('calculates file statistics correctly', () => {
    const { result } = renderHook(() => useFileManager())
    
    // Simular archivos en el estado
    act(() => {
      result.current.setFiles([
        {
          id: '1',
          name: 'image.jpg',
          size: 1024,
          type: 'image/jpeg',
          url: 'url1',
          cloudinaryId: 'id1',
          category: 'image',
          uploadedAt: new Date(),
          uploadedBy: 'user1'
        },
        {
          id: '2',
          name: 'doc.pdf',
          size: 2048,
          type: 'application/pdf',
          url: 'url2',
          cloudinaryId: 'id2',
          category: 'document',
          uploadedAt: new Date(),
          uploadedBy: 'user1'
        }
      ])
    })
    
    const stats = result.current.getFileStats()
    
    expect(stats.totalFiles).toBe(2)
    expect(stats.totalSize).toBe(3072)
    expect(stats.byCategory.image).toBe(1)
    expect(stats.byCategory.document).toBe(1)
    expect(stats.averageSize).toBe(1536)
  })

  it('filters files correctly in fetchFiles', async () => {
    const mockUnsubscribe = jest.fn()
    mockFirestore.onSnapshot.mockImplementationOnce((query, callback) => {
      // Simular datos de Firestore
      const mockSnapshot = {
        docs: [
          {
            id: '1',
            data: () => ({
              name: 'test.pdf',
              uploadedBy: 'user1',
              relatedType: 'contact',
              uploadedAt: { toDate: () => new Date() }
            })
          }
        ]
      }
      callback(mockSnapshot)
      return mockUnsubscribe
    })
    
    const { result } = renderHook(() => useFileManager())
    
    let unsubscribe
    await act(async () => {
      unsubscribe = await result.current.fetchFiles({
        userId: 'user1',
        relatedType: 'contact'
      })
    })
    
    expect(mockFirestore.query).toHaveBeenCalled()
    expect(mockFirestore.where).toHaveBeenCalledWith('uploadedBy', '==', 'user1')
    expect(mockFirestore.where).toHaveBeenCalledWith('relatedType', '==', 'contact')
    expect(unsubscribe).toBe(mockUnsubscribe)
  })

  it('updates file metadata correctly', async () => {
    const { result } = renderHook(() => useFileManager())
    
    const updates = {
      description: 'Updated description',
      tags: ['tag1', 'tag2']
    }
    
    let updateResult
    await act(async () => {
      updateResult = await result.current.updateFileMetadata('file-id', updates)
    })
    
    expect(mockFirestore.updateDoc).toHaveBeenCalledWith(
      expect.anything(),
      updates
    )
    expect(updateResult).toBe(true)
  })

  it('handles Firestore errors gracefully', async () => {
    mockFirestore.addDoc.mockRejectedValueOnce(new Error('Firestore error'))
    
    const { result } = renderHook(() => useFileManager())
    
    const fileData = {
      name: 'test.pdf',
      size: 1024,
      type: 'application/pdf',
      url: 'https://example.com/test.pdf',
      cloudinaryId: 'test_id',
      category: 'document' as const,
      uploadedAt: new Date(),
      uploadedBy: 'test-user'
    }
    
    await act(async () => {
      try {
        await result.current.saveFileRecord(fileData)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toContain('Error al guardar el registro del archivo')
      }
    })
  })
})