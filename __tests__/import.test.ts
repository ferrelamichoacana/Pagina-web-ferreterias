import { format } from 'date-fns'

describe('Import Test', () => {
  it('should be able to import external modules', () => {
    const date = new Date('2025-01-01T12:00:00Z')
    const formatted = format(date, 'yyyy-MM-dd')
    expect(formatted).toBe('2025-01-01')
  })
})
