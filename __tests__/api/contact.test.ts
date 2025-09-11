import { POST } from '@/app/api/contact/route'
import { NextRequest } from 'next/server'

// Mock Firebase
jest.mock('@/lib/utils/firestore', () => ({
  createContactRequest: jest.fn()
}))

// Mock Email Service
jest.mock('@/lib/email/emailService', () => ({
  sendContactConfirmation: jest.fn()
}))

const mockCreateContactRequest = require('@/lib/utils/firestore').createContactRequest
const mockSendContactConfirmation = require('@/lib/email/emailService').sendContactConfirmation

describe('/api/contact', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('successfully creates contact request', async () => {
    const trackingId = 'REQ-2025-001'
    mockCreateContactRequest.mockResolvedValueOnce(trackingId)
    mockSendContactConfirmation.mockResolvedValueOnce({ success: true })

    const requestData = {
      companyName: 'Test Company',
      contactName: 'Juan Pérez',
      email: 'test@example.com',
      phone: '555-1234',
      branchId: 'branch1',
      location: 'Test Location',
      estimatedBudget: '10000-50000',
      projectDescription: 'Test project description',
      subscribeNewsletter: true
    }

    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(requestData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.trackingId).toBe(trackingId)
    expect(mockCreateContactRequest).toHaveBeenCalledWith(
      expect.objectContaining(requestData)
    )
    expect(mockSendContactConfirmation).toHaveBeenCalledWith({
      clientEmail: requestData.email,
      clientName: requestData.contactName,
      trackingId,
      companyName: requestData.companyName,
      projectDescription: requestData.projectDescription
    })
  })

  it('validates required fields', async () => {
    const incompleteData = {
      companyName: 'Test Company',
      // Missing required fields
    }

    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(incompleteData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Todos los campos requeridos')
  })

  it('validates email format', async () => {
    const invalidEmailData = {
      companyName: 'Test Company',
      contactName: 'Juan Pérez',
      email: 'invalid-email',
      phone: '555-1234',
      branchId: 'branch1',
      location: 'Test Location',
      estimatedBudget: '10000-50000',
      projectDescription: 'Test project description',
      subscribeNewsletter: false
    }

    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(invalidEmailData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Email inválido')
  })

  it('validates phone format', async () => {
    const invalidPhoneData = {
      companyName: 'Test Company',
      contactName: 'Juan Pérez',
      email: 'test@example.com',
      phone: '123', // Too short
      branchId: 'branch1',
      location: 'Test Location',
      estimatedBudget: '10000-50000',
      projectDescription: 'Test project description',
      subscribeNewsletter: false
    }

    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(invalidPhoneData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Teléfono inválido')
  })

  it('handles Firestore errors gracefully', async () => {
    mockCreateContactRequest.mockRejectedValueOnce(new Error('Firestore error'))

    const validData = {
      companyName: 'Test Company',
      contactName: 'Juan Pérez',
      email: 'test@example.com',
      phone: '555-1234',
      branchId: 'branch1',
      location: 'Test Location',
      estimatedBudget: '10000-50000',
      projectDescription: 'Test project description',
      subscribeNewsletter: false
    }

    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(validData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error interno del servidor')
  })

  it('continues operation even if email fails', async () => {
    const trackingId = 'REQ-2025-001'
    mockCreateContactRequest.mockResolvedValueOnce(trackingId)
    mockSendContactConfirmation.mockRejectedValueOnce(new Error('Email error'))

    const validData = {
      companyName: 'Test Company',
      contactName: 'Juan Pérez',
      email: 'test@example.com',
      phone: '555-1234',
      branchId: 'branch1',
      location: 'Test Location',
      estimatedBudget: '10000-50000',
      projectDescription: 'Test project description',
      subscribeNewsletter: false
    }

    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(validData)
    })

    const response = await POST(request)
    const data = await response.json()

    // Should still succeed even if email fails
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.trackingId).toBe(trackingId)
  })

  it('handles malformed JSON', async () => {
    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: 'invalid json'
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Datos inválidos')
  })

  it('validates budget range format', async () => {
    const invalidBudgetData = {
      companyName: 'Test Company',
      contactName: 'Juan Pérez',
      email: 'test@example.com',
      phone: '555-1234',
      branchId: 'branch1',
      location: 'Test Location',
      estimatedBudget: 'invalid-budget',
      projectDescription: 'Test project description',
      subscribeNewsletter: false
    }

    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(invalidBudgetData)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Presupuesto inválido')
  })

  it('sanitizes input data', async () => {
    const trackingId = 'REQ-2025-001'
    mockCreateContactRequest.mockResolvedValueOnce(trackingId)
    mockSendContactConfirmation.mockResolvedValueOnce({ success: true })

    const dataWithScripts = {
      companyName: '<script>alert("xss")</script>Test Company',
      contactName: 'Juan Pérez<script>',
      email: 'test@example.com',
      phone: '555-1234',
      branchId: 'branch1',
      location: 'Test Location',
      estimatedBudget: '10000-50000',
      projectDescription: 'Test <script>alert("xss")</script> description',
      subscribeNewsletter: false
    }

    const request = new NextRequest('http://localhost/api/contact', {
      method: 'POST',
      body: JSON.stringify(dataWithScripts)
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(mockCreateContactRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        companyName: expect.not.stringContaining('<script>'),
        contactName: expect.not.stringContaining('<script>'),
        projectDescription: expect.not.stringContaining('<script>')
      })
    )
  })
})