// Mock environment and dependencies first
process.env.RESEND_API_KEY = 'test-key'

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn()
    }
  }))
}))

import * as emailService from '@/lib/email/emailService'

describe('Alias Import Test', () => {
  it('should be able to import using @/ alias', () => {
    expect(emailService).toBeDefined()
  })
})
