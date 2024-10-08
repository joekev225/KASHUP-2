import { loginSchema, transactionSchema, withdrawalSchema } from '../lib/validations'

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = { email: 'test@example.com', password: 'password123' }
      expect(() => loginSchema.parse(validData)).not.toThrow()
    })

    it('should throw error for invalid email', () => {
      const invalidData = { email: 'invalid-email', password: 'password123' }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })
  })

  // Ajoutez des tests similaires pour transactionSchema et withdrawalSchema
})
