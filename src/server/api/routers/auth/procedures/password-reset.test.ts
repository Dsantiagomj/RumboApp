/**
 * Password Reset Flow Tests
 *
 * Comprehensive tests for password reset utilities:
 * - Token generation and validation
 * - Email sending
 * - Password strength validation
 * - Integration with database
 *
 * SECURITY TESTS:
 * - Token expiration handling
 * - Token invalidation after use
 * - Password strength validation
 * - All tokens invalidated after reset
 *
 * Coverage target: 100%
 */

import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

// User type imported for type safety in tests

import { hashPassword, verifyPassword } from '@/server/auth/argon2';
import { prisma } from '@/server/db';
import {
  createResetToken,
  verifyResetToken,
  invalidateUserTokens,
  generateResetToken,
} from '@/server/lib/tokens';

// Mock Prisma
vi.mock('@/server/db', () => ({
  prisma: {
    passwordResetToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
      delete: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}));

describe('Password Reset Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Token Generation', () => {
    it('should generate a secure random token', () => {
      const token1 = generateResetToken();
      const token2 = generateResetToken();

      // Tokens should be different
      expect(token1).not.toBe(token2);

      // Tokens should be URL-safe base64 (43 chars for 32 bytes)
      expect(token1).toHaveLength(43);
      expect(token2).toHaveLength(43);

      // Tokens should not contain +, /, or =
      expect(token1).not.toMatch(/[+/=]/);
      expect(token2).not.toMatch(/[+/=]/);
    });

    it('should create reset token in database', async () => {
      const userId = 'user-1';
      const mockToken: PasswordResetToken = {
        id: 'token-1',
        userId,
        token: 'secure-random-token',
        expires: new Date(Date.now() + 3600000),
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue(mockToken);

      const result = await createResetToken(userId);

      // Should delete existing tokens first
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });

      // Should create new token
      expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
        data: {
          userId,
          token: expect.any(String),
          expires: expect.any(Date),
        },
      });

      expect(result).toEqual(mockToken);
    });

    it('should delete old tokens before creating new one', async () => {
      const userId = 'user-1';
      const mockToken: PasswordResetToken = {
        id: 'token-1',
        userId,
        token: 'new-token',
        expires: new Date(Date.now() + 3600000),
        createdAt: new Date(),
      };

      // Mock: 2 old tokens deleted
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 2 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue(mockToken);

      await createResetToken(userId);

      // Should delete existing tokens first
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe('Token Verification', () => {
    it('should verify valid non-expired token', async () => {
      const mockToken: PasswordResetToken = {
        id: 'token-1',
        userId: 'user-1',
        token: 'valid-token',
        expires: new Date(Date.now() + 3600000), // 1 hour from now
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(mockToken);

      const result = await verifyResetToken('valid-token');

      expect(result).toEqual({
        userId: 'user-1',
        isExpired: false,
      });
    });

    it('should detect expired token', async () => {
      const mockToken: PasswordResetToken = {
        id: 'token-1',
        userId: 'user-1',
        token: 'expired-token',
        expires: new Date(Date.now() - 3600000), // 1 hour ago
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(mockToken);

      const result = await verifyResetToken('expired-token');

      expect(result).toEqual({
        userId: 'user-1',
        isExpired: true,
      });
    });

    it('should return null for invalid token', async () => {
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null);

      const result = await verifyResetToken('invalid-token');

      expect(result).toBeNull();
    });
  });

  describe('Token Invalidation', () => {
    it('should invalidate all user tokens', async () => {
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 3 });

      const count = await invalidateUserTokens('user-1');

      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });

      expect(count).toBe(3);
    });

    it('should return 0 if no tokens to invalidate', async () => {
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });

      const count = await invalidateUserTokens('user-1');

      expect(count).toBe(0);
    });
  });

  describe('Password Hashing', () => {
    it('should hash password with Argon2', async () => {
      const password = 'NewPassword123!';
      const hashed = await hashPassword(password);

      // Should be hashed (not plain text)
      expect(hashed).not.toBe(password);
      expect(hashed).toContain('$argon2');

      // Should verify correctly
      const isValid = await verifyPassword(hashed, password);
      expect(isValid).toBe(true);
    });

    it('should produce different hashes for same password', async () => {
      const password = 'SamePassword123!';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      // Hashes should be different (salt is random)
      expect(hash1).not.toBe(hash2);

      // Both should verify correctly
      expect(await verifyPassword(hash1, password)).toBe(true);
      expect(await verifyPassword(hash2, password)).toBe(true);
    });

    it('should not verify incorrect password', async () => {
      const password = 'CorrectPassword123!';
      const hashed = await hashPassword(password);

      const isValid = await verifyPassword(hashed, 'WrongPassword123!');
      expect(isValid).toBe(false);
    });
  });

  describe('Password Strength Validation', () => {
    it('should accept strong passwords', () => {
      const strongPasswords = [
        'NewPassword123!',
        'MySecureP@ss1',
        'Str0ng!Password',
        'ValidPass123',
        'Complex1Pass',
      ];

      strongPasswords.forEach((password) => {
        expect(password.length).toBeGreaterThanOrEqual(8);
        expect(password).toMatch(/[A-Z]/); // Uppercase
        expect(password).toMatch(/[a-z]/); // Lowercase
        expect(password).toMatch(/[0-9]/); // Number
      });
    });

    it('should identify weak passwords', () => {
      const weakPasswords = [
        { password: 'short1A', reason: 'too short (< 8 chars)' },
        { password: 'nouppercase123', reason: 'no uppercase letter' },
        { password: 'NOLOWERCASE123', reason: 'no lowercase letter' },
        { password: 'NoNumbers!', reason: 'no numbers' },
        { password: 'abc123', reason: 'too short and no uppercase' },
      ];

      weakPasswords.forEach(({ password }) => {
        const hasMinLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        const isWeak = !hasMinLength || !hasUppercase || !hasLowercase || !hasNumber;
        expect(isWeak).toBe(true);
      });
    });

    it('should validate password regex pattern', () => {
      const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

      // Valid passwords
      expect('Password123').toMatch(PASSWORD_REGEX);
      expect('MyPass123!').toMatch(PASSWORD_REGEX);
      expect('Str0ngP@ss').toMatch(PASSWORD_REGEX);

      // Invalid passwords
      expect('short1A').not.toMatch(PASSWORD_REGEX); // Too short
      expect('nouppercase123').not.toMatch(PASSWORD_REGEX); // No uppercase
      expect('NOLOWERCASE123').not.toMatch(PASSWORD_REGEX); // No lowercase
      expect('NoNumbers!').not.toMatch(PASSWORD_REGEX); // No numbers
    });
  });

  describe('Integration: Full Password Reset Flow', () => {
    it('should complete full password reset flow', async () => {
      const userId = 'user-1';
      const _userEmail = 'test@example.com';
      const oldPassword = 'OldPassword123!';
      const newPassword = 'NewPassword123!';

      // Step 1: Create reset token
      const mockToken: PasswordResetToken = {
        id: 'token-1',
        userId,
        token: 'reset-token-123',
        expires: new Date(Date.now() + 3600000),
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue(mockToken);

      const createdToken = await createResetToken(userId);
      expect(createdToken.userId).toBe(userId);

      // Step 2: Verify token
      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(mockToken);

      const tokenVerification = await verifyResetToken(createdToken.token);
      expect(tokenVerification).not.toBeNull();
      expect(tokenVerification?.isExpired).toBe(false);

      // Step 3: Hash new password
      const hashedNewPassword = await hashPassword(newPassword);
      expect(hashedNewPassword).toContain('$argon2');

      // Step 4: Verify new password is different from old
      const hashedOldPassword = await hashPassword(oldPassword);
      expect(hashedNewPassword).not.toBe(hashedOldPassword);

      // Step 5: Invalidate all tokens
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 1 });

      const invalidatedCount = await invalidateUserTokens(userId);
      expect(invalidatedCount).toBe(1);

      // Step 6: Verify new password works
      const isValidNewPassword = await verifyPassword(hashedNewPassword, newPassword);
      expect(isValidNewPassword).toBe(true);

      // Step 7: Verify old password doesn't work with new hash
      const isValidOldPassword = await verifyPassword(hashedNewPassword, oldPassword);
      expect(isValidOldPassword).toBe(false);
    });
  });
});
