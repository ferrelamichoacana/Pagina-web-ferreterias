// Test with relative import
// Mock Resend before importing
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn()
    }
  }))
}))

// Set up environment variable
process.env.RESEND_API_KEY = 'test-key'

import * as emailService from '../lib/email/emailService'

describe('Relative Import Test', () => {
  it('should be able to import local modules with relative paths', () => {
    expect(emailService).toBeDefined()
  })
})
