/**
 * Auth schemas tests
 *
 * Tests Zod validation schemas for authentication:
 * - registerSchema: Email, password, name validation
 * - loginSchema: Email, password validation
 */

import { describe, expect, it } from 'vitest';

import { loginSchema, registerSchema } from './schemas';

describe('Auth Schemas', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Test1234!',
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('email');
        expect(result.error.issues[0]?.message).toBe('Invalid email address');
      }
    });

    it('should reject password that is too short', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test1!', // Only 6 characters
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) => issue.path[0] === 'password');
        expect(passwordError?.message).toBe('Password must be at least 8 characters');
      }
    });

    it('should reject password without uppercase letter', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'test1234!', // No uppercase
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) => issue.path[0] === 'password');
        expect(passwordError?.message).toBe('Password must contain at least one uppercase letter');
      }
    });

    it('should reject password without lowercase letter', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'TEST1234!', // No lowercase
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) => issue.path[0] === 'password');
        expect(passwordError?.message).toBe('Password must contain at least one lowercase letter');
      }
    });

    it('should reject password without number', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'TestPassword!', // No number
        name: 'Test User',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) => issue.path[0] === 'password');
        expect(passwordError?.message).toBe('Password must contain at least one number');
      }
    });

    it('should reject empty name', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test1234!',
        name: '',
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((issue) => issue.path[0] === 'name');
        expect(nameError?.message).toBe('Name is required');
      }
    });

    it('should reject name that is too long', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'a'.repeat(256), // 256 characters
      };

      const result = registerSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const nameError = result.error.issues.find((issue) => issue.path[0] === 'name');
        expect(nameError?.message).toBe('Name is too long');
      }
    });

    it('should accept name at maximum length (255 characters)', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'a'.repeat(255),
      };

      const result = registerSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test1234!',
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validData);
      }
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Test1234!',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain('email');
        expect(result.error.issues[0]?.message).toBe('Invalid email address');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.error.issues.find((issue) => issue.path[0] === 'password');
        expect(passwordError?.message).toBe('Password is required');
      }
    });

    it('should accept any non-empty password (login does not validate password strength)', () => {
      const validData = {
        email: 'test@example.com',
        password: 'weak', // Login accepts any password
      };

      const result = loginSchema.safeParse(validData);

      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const invalidData = {
        password: 'Test1234!',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const result = loginSchema.safeParse(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe('Type exports', () => {
    it('should export RegisterInput type', () => {
      // This is a type-level test
      // If this compiles, the type exists
      const validData: typeof registerSchema._type = {
        email: 'test@example.com',
        password: 'Test1234!',
        name: 'Test User',
      };

      expect(validData).toBeDefined();
    });

    it('should export LoginInput type', () => {
      // This is a type-level test
      // If this compiles, the type exists
      const validData: typeof loginSchema._type = {
        email: 'test@example.com',
        password: 'Test1234!',
      };

      expect(validData).toBeDefined();
    });
  });
});
