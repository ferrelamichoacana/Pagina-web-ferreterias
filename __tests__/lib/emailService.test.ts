import { 
  sendContactConfirmation,
  sendVendorAssignmentNotification,
  sendQuotationEmail,
  sendJobApplicationConfirmation,
  sendJobApplicationStatusUpdate
} from '@/lib/email/emailService'

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn()
    }
  }))
}))

const mockResend = require('resend').Resend

describe('Email Service', () => {
  let mockSend: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockSend = jest.fn()
    mockResend.mockImplementation(() => ({
      emails: { send: mockSend }
    }))
  })

  describe('sendContactConfirmation', () => {
    it('sends contact confirmation email successfully', async () => {
      mockSend.mockResolvedValueOnce({ id: 'email-id' })

      const emailData = {
        clientEmail: 'test@example.com',
        clientName: 'Juan Pérez',
        trackingId: 'REQ-2025-001',
        companyName: 'Test Company',
        projectDescription: 'Test project'
      }

      const result = await sendContactConfirmation(emailData)

      expect(mockSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: 'test@example.com',
        subject: expect.stringContaining('REQ-2025-001'),
        html: expect.stringContaining('Juan Pérez')
      })
      expect(result.success).toBe(true)
    })

    it('handles email sending errors', async () => {
      mockSend.mockRejectedValueOnce(new Error('Email service error'))

      const emailData = {
        clientEmail: 'test@example.com',
        clientName: 'Juan Pérez',
        trackingId: 'REQ-2025-001',
        companyName: 'Test Company',
        projectDescription: 'Test project'
      }

      const result = await sendContactConfirmation(emailData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Error al enviar email')
    })

    it('validates email format', async () => {
      const emailData = {
        clientEmail: 'invalid-email',
        clientName: 'Juan Pérez',
        trackingId: 'REQ-2025-001',
        companyName: 'Test Company',
        projectDescription: 'Test project'
      }

      const result = await sendContactConfirmation(emailData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Email inválido')
    })
  })

  describe('sendVendorAssignmentNotification', () => {
    it('sends vendor assignment notification successfully', async () => {
      mockSend.mockResolvedValueOnce({ id: 'email-id' })

      const emailData = {
        clientEmail: 'client@example.com',
        clientName: 'Juan Pérez',
        vendorName: 'Carlos Vendedor',
        vendorPhone: '555-1234',
        vendorEmail: 'vendor@example.com',
        trackingId: 'REQ-2025-001'
      }

      const result = await sendVendorAssignmentNotification(emailData)

      expect(mockSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: 'client@example.com',
        subject: expect.stringContaining('vendedor asignado'),
        html: expect.stringContaining('Carlos Vendedor')
      })
      expect(result.success).toBe(true)
    })
  })

  describe('sendQuotationEmail', () => {
    it('sends quotation email with items', async () => {
      mockSend.mockResolvedValueOnce({ id: 'email-id' })

      const emailData = {
        clientEmail: 'client@example.com',
        clientName: 'Juan Pérez',
        quotationNumber: 'COT-2025-001',
        vendorName: 'Carlos Vendedor',
        vendorEmail: 'vendor@example.com',
        total: 15000,
        validUntil: '2025-01-15',
        items: [
          { name: 'Cemento', quantity: 10, price: 150 },
          { name: 'Arena', quantity: 5, price: 200 }
        ]
      }

      const result = await sendQuotationEmail(emailData)

      expect(mockSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: 'client@example.com',
        subject: expect.stringContaining('COT-2025-001'),
        html: expect.stringContaining('$15,000')
      })
      expect(result.success).toBe(true)
    })

    it('handles empty items array', async () => {
      mockSend.mockResolvedValueOnce({ id: 'email-id' })

      const emailData = {
        clientEmail: 'client@example.com',
        clientName: 'Juan Pérez',
        quotationNumber: 'COT-2025-001',
        vendorName: 'Carlos Vendedor',
        vendorEmail: 'vendor@example.com',
        total: 0,
        validUntil: '2025-01-15',
        items: []
      }

      const result = await sendQuotationEmail(emailData)

      expect(result.success).toBe(true)
      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          html: expect.stringContaining('No hay productos')
        })
      )
    })
  })

  describe('sendJobApplicationConfirmation', () => {
    it('sends job application confirmation', async () => {
      mockSend.mockResolvedValueOnce({ id: 'email-id' })

      const emailData = {
        applicantEmail: 'applicant@example.com',
        applicantName: 'María García',
        jobTitle: 'Vendedor',
        branchName: 'Sucursal Centro',
        applicationId: 'APP-2025-001'
      }

      const result = await sendJobApplicationConfirmation(emailData)

      expect(mockSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: 'applicant@example.com',
        subject: expect.stringContaining('aplicación recibida'),
        html: expect.stringContaining('María García')
      })
      expect(result.success).toBe(true)
    })
  })

  describe('sendJobApplicationStatusUpdate', () => {
    it('sends status update for different statuses', async () => {
      mockSend.mockResolvedValueOnce({ id: 'email-id' })

      const emailData = {
        applicantEmail: 'applicant@example.com',
        applicantName: 'María García',
        jobTitle: 'Vendedor',
        status: 'entrevista',
        notes: 'Programada para el lunes'
      }

      const result = await sendJobApplicationStatusUpdate(emailData)

      expect(mockSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: 'applicant@example.com',
        subject: expect.stringContaining('actualización'),
        html: expect.stringContaining('entrevista')
      })
      expect(result.success).toBe(true)
    })

    it('handles different status types correctly', async () => {
      mockSend.mockResolvedValueOnce({ id: 'email-id' })

      const statuses = ['revisada', 'entrevista', 'contratada', 'rechazada']
      
      for (const status of statuses) {
        const emailData = {
          applicantEmail: 'applicant@example.com',
          applicantName: 'María García',
          jobTitle: 'Vendedor',
          status,
          notes: 'Test notes'
        }

        const result = await sendJobApplicationStatusUpdate(emailData)
        expect(result.success).toBe(true)
      }

      expect(mockSend).toHaveBeenCalledTimes(statuses.length)
    })
  })

  describe('Email validation', () => {
    it('validates email format correctly', async () => {
      const invalidEmails = [
        'invalid-email',
        '@example.com',
        'test@',
        'test..test@example.com',
        ''
      ]

      for (const email of invalidEmails) {
        const result = await sendContactConfirmation({
          clientEmail: email,
          clientName: 'Test',
          trackingId: 'REQ-001',
          companyName: 'Test',
          projectDescription: 'Test'
        })

        expect(result.success).toBe(false)
        expect(result.error).toContain('Email inválido')
      }
    })

    it('accepts valid email formats', async () => {
      mockSend.mockResolvedValue({ id: 'email-id' })

      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'user+tag@example.org',
        'user123@test-domain.com'
      ]

      for (const email of validEmails) {
        const result = await sendContactConfirmation({
          clientEmail: email,
          clientName: 'Test',
          trackingId: 'REQ-001',
          companyName: 'Test',
          projectDescription: 'Test'
        })

        expect(result.success).toBe(true)
      }
    })
  })

  describe('Rate limiting', () => {
    it('handles rate limiting gracefully', async () => {
      mockSend.mockRejectedValueOnce({
        message: 'Rate limit exceeded'
      })

      const emailData = {
        clientEmail: 'test@example.com',
        clientName: 'Test',
        trackingId: 'REQ-001',
        companyName: 'Test',
        projectDescription: 'Test'
      }

      const result = await sendContactConfirmation(emailData)

      expect(result.success).toBe(false)
      expect(result.error).toContain('Error al enviar email')
    })
  })
})