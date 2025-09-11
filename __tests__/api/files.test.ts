import { DELETE } from '@/app/api/files/delete/route'
import { NextRequest } from 'next/server'

// Mock Cloudinary
jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      destroy: jest.fn()
    }
  }
}))

const mockCloudinary = require('cloudinary').v2

describe('/api/files/delete', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('successfully deletes file from Cloudinary', async () => {
    mockCloudinary.uploader.destroy.mockResolvedValueOnce({
      result: 'ok'
    })

    const request = new NextRequest('http://localhost/api/files/delete', {
      method: 'DELETE',
      body: JSON.stringify({ cloudinaryId: 'test_id' })
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(mockCloudinary.uploader.destroy).toHaveBeenCalledWith('test_id')
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.message).toBe('Archivo eliminado correctamente')
  })

  it('returns error when cloudinaryId is missing', async () => {
    const request = new NextRequest('http://localhost/api/files/delete', {
      method: 'DELETE',
      body: JSON.stringify({})
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('ID de Cloudinary requerido')
  })

  it('handles Cloudinary deletion failure', async () => {
    mockCloudinary.uploader.destroy.mockResolvedValueOnce({
      result: 'not found'
    })

    const request = new NextRequest('http://localhost/api/files/delete', {
      method: 'DELETE',
      body: JSON.stringify({ cloudinaryId: 'invalid_id' })
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error al eliminar archivo de Cloudinary')
  })

  it('handles Cloudinary API errors', async () => {
    mockCloudinary.uploader.destroy.mockRejectedValueOnce(
      new Error('Cloudinary API error')
    )

    const request = new NextRequest('http://localhost/api/files/delete', {
      method: 'DELETE',
      body: JSON.stringify({ cloudinaryId: 'test_id' })
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error interno del servidor')
  })

  it('handles malformed JSON request', async () => {
    const request = new NextRequest('http://localhost/api/files/delete', {
      method: 'DELETE',
      body: 'invalid json'
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error interno del servidor')
  })
})