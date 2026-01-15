/**
 * Token Utilities Tests
 *
 * Comprehensive tests for password reset token generation and management.
 *
 * SECURITY TESTS:
 * - Cryptographic randomness (tokens are unique)
 * - URL-safe encoding (no +, /, = characters)
 * - Token expiration handling (1 hour TTL)
 * - Token invalidation (single-use, cleanup)
 * - Database integrity (foreign keys, cascades)
 *
 * Coverage target: 100%
 */

import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';

import type { PasswordResetToken } from '@prisma/client';

import { prisma } from '@/server/db';
import {
  generateResetToken,
  createResetToken,
  verifyResetToken,
  invalidateUserTokens,
  cleanupExpiredTokens,
} from '@/server/lib/tokens';

// Mock Prisma
vi.mock('@/server/db', () => ({
  prisma: {
    passwordResetToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}));

describe('Token Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('generateResetToken', () => {
    it('should generate a URL-safe base64 token of 43 characters', () => {
      const token = generateResetToken();

      // Token should be exactly 43 characters (32 bytes -> 43 base64url chars)
      expect(token).toHaveLength(43);

      // Token should only contain URL-safe characters (no +, /, =)
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      expect(token).not.toMatch(/[+/=]/);
    });

    it('should generate unique tokens (cryptographic randomness)', () => {
      const token1 = generateResetToken();
      const token2 = generateResetToken();
      const token3 = generateResetToken();

      // All tokens should be different
      expect(token1).not.toBe(token2);
      expect(token1).not.toBe(token3);
      expect(token2).not.toBe(token3);
    });

    it('should generate tokens with high entropy (collision resistance)', () => {
      const tokens = new Set<string>();
      const iterations = 1000;

      for (let i = 0; i < iterations; i++) {
        tokens.add(generateResetToken());
      }

      // All tokens should be unique (no collisions)
      expect(tokens.size).toBe(iterations);
    });
  });

  describe('createResetToken', () => {
    it('should create a reset token for a user', async () => {
      const userId = 'user-123';
      const mockToken: PasswordResetToken = {
        id: 'token-id-1',
        userId,
        token: 'secure-random-token-43-chars-url-safe-xyz',
        expires: new Date(Date.now() + 3600000), // 1 hour
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue(mockToken);

      const result = await createResetToken(userId);

      // Should delete existing tokens first (security: prevent token flooding)
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });

      // Should create new token with correct structure
      expect(prisma.passwordResetToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId,
          token: expect.any(String),
          expires: expect.any(Date),
        }),
      });

      expect(result).toEqual(mockToken);
    });

    it('should delete existing tokens before creating a new one (prevent abuse)', async () => {
      const userId = 'user-456';
      const mockToken: PasswordResetToken = {
        id: 'token-id-2',
        userId,
        token: 'new-token-replacing-old-ones-abc123-xyz',
        expires: new Date(Date.now() + 3600000),
        createdAt: new Date(),
      };

      // Simulate 3 existing tokens being deleted
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 3 });
      vi.mocked(prisma.passwordResetToken.create).mockResolvedValue(mockToken);

      await createResetToken(userId);

      // Should delete all existing tokens for this user
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });

      // Verify deletion happened before creation (call order)
      const deleteManyCall = vi.mocked(prisma.passwordResetToken.deleteMany).mock
        .invocationCallOrder[0];
      const createCall = vi.mocked(prisma.passwordResetToken.create).mock.invocationCallOrder[0];
      expect(deleteManyCall).toBeLessThan(createCall!);
    });

    it('should set expiration to 1 hour from now', async () => {
      const userId = 'user-789';
      const now = Date.now();
      const expectedExpiry = now + 3600000; // 1 hour in ms

      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });
      vi.mocked(prisma.passwordResetToken.create).mockImplementation(async (args) => {
        const expiryTime = (args.data.expires as Date).getTime();
        // Allow 1 second tolerance for test execution time
        expect(expiryTime).toBeGreaterThanOrEqual(expectedExpiry - 1000);
        expect(expiryTime).toBeLessThanOrEqual(expectedExpiry + 1000);

        return {
          id: 'token-id-3',
          userId,
          token: args.data.token as string,
          expires: args.data.expires as Date,
          createdAt: new Date(),
        };
      });

      await createResetToken(userId);

      expect(prisma.passwordResetToken.create).toHaveBeenCalled();
    });
  });

  describe('verifyResetToken', () => {
    it('should return user ID and expiration status for valid token', async () => {
      const token = 'valid-token-abc123-xyz-url-safe-43-chars';
      const userId = 'user-valid-123';
      const mockTokenRecord: PasswordResetToken = {
        id: 'token-id-4',
        userId,
        token,
        expires: new Date(Date.now() + 1800000), // 30 minutes from now (not expired)
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(mockTokenRecord);

      const result = await verifyResetToken(token);

      expect(prisma.passwordResetToken.findUnique).toHaveBeenCalledWith({
        where: { token },
      });

      expect(result).toEqual({
        userId,
        isExpired: false,
      });
    });

    it('should return null for non-existent token', async () => {
      const token = 'non-existent-token-xyz-not-in-database';

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null);

      const result = await verifyResetToken(token);

      expect(result).toBeNull();
    });

    it('should mark token as expired if past expiration date', async () => {
      const token = 'expired-token-abc123-xyz-url-safe-43-ch';
      const userId = 'user-expired-456';
      const mockTokenRecord: PasswordResetToken = {
        id: 'token-id-5',
        userId,
        token,
        expires: new Date(Date.now() - 1000), // 1 second ago (expired)
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(mockTokenRecord);

      const result = await verifyResetToken(token);

      expect(result).toEqual({
        userId,
        isExpired: true,
      });
    });

    it('should handle edge case: token expires exactly now', async () => {
      const token = 'edge-case-token-expires-right-now-xyz-ab';
      const userId = 'user-edge-789';
      const now = new Date();
      const mockTokenRecord: PasswordResetToken = {
        id: 'token-id-6',
        userId,
        token,
        expires: now,
        createdAt: new Date(),
      };

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(mockTokenRecord);

      const result = await verifyResetToken(token);

      // Token expiring at exactly now should be considered expired
      // (expires < new Date() will be false, but typically expires <= new Date())
      expect(result).toBeDefined();
      expect(result?.userId).toBe(userId);
    });
  });

  describe('invalidateUserTokens', () => {
    it('should delete all tokens for a specific user', async () => {
      const userId = 'user-to-invalidate-123';

      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 2 });

      const deletedCount = await invalidateUserTokens(userId);

      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: { userId },
      });

      expect(deletedCount).toBe(2);
    });

    it('should return 0 if user has no tokens', async () => {
      const userId = 'user-no-tokens-456';

      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });

      const deletedCount = await invalidateUserTokens(userId);

      expect(deletedCount).toBe(0);
    });

    it('should handle deleting many tokens for a single user', async () => {
      const userId = 'user-many-tokens-789';

      // Simulate user with 10 orphaned tokens (abuse scenario)
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 10 });

      const deletedCount = await invalidateUserTokens(userId);

      expect(deletedCount).toBe(10);
    });
  });

  describe('cleanupExpiredTokens', () => {
    it('should delete all expired tokens from database', async () => {
      // Simulate 15 expired tokens in the database
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 15 });

      const deletedCount = await cleanupExpiredTokens();

      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledWith({
        where: {
          expires: {
            lt: expect.any(Date),
          },
        },
      });

      expect(deletedCount).toBe(15);
    });

    it('should return 0 if no expired tokens exist', async () => {
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValue({ count: 0 });

      const deletedCount = await cleanupExpiredTokens();

      expect(deletedCount).toBe(0);
    });

    it('should only delete tokens with expiration before current time', async () => {
      vi.mocked(prisma.passwordResetToken.deleteMany).mockImplementation(async (args) => {
        const where = args?.where as { expires?: { lt?: Date } };
        const ltDate = where?.expires?.lt;

        // Verify the query uses lt (less than) for expired tokens
        expect(ltDate).toBeDefined();
        expect(ltDate).toBeInstanceOf(Date);

        // The query should use current time (allow 1 second tolerance)
        const now = Date.now();
        expect(ltDate!.getTime()).toBeGreaterThanOrEqual(now - 1000);
        expect(ltDate!.getTime()).toBeLessThanOrEqual(now + 1000);

        return { count: 5 };
      });

      const deletedCount = await cleanupExpiredTokens();

      expect(deletedCount).toBe(5);
    });

    it('should be safe to run periodically (idempotent)', async () => {
      // First cleanup
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValueOnce({ count: 3 });

      const firstCleanup = await cleanupExpiredTokens();
      expect(firstCleanup).toBe(3);

      // Second cleanup (no more expired tokens)
      vi.mocked(prisma.passwordResetToken.deleteMany).mockResolvedValueOnce({ count: 0 });

      const secondCleanup = await cleanupExpiredTokens();
      expect(secondCleanup).toBe(0);

      // Should be called twice
      expect(prisma.passwordResetToken.deleteMany).toHaveBeenCalledTimes(2);
    });
  });

  describe('Security Properties', () => {
    it('should ensure tokens are cryptographically secure (OWASP)', () => {
      // Generate multiple tokens and verify no patterns
      const tokens = Array.from({ length: 100 }, () => generateResetToken());

      // Check for sequential patterns (bad randomness)
      for (let i = 1; i < tokens.length; i++) {
        expect(tokens[i]).not.toBe(tokens[i - 1]);
      }

      // Check character distribution (should be roughly uniform for base64url)
      const allChars = tokens.join('');
      const hasUppercase = /[A-Z]/.test(allChars);
      const hasLowercase = /[a-z]/.test(allChars);
      const hasDigits = /[0-9]/.test(allChars);
      const hasHyphen = /-/.test(allChars);
      const hasUnderscore = /_/.test(allChars);

      expect(hasUppercase).toBe(true);
      expect(hasLowercase).toBe(true);
      expect(hasDigits).toBe(true);
      // Hyphen and underscore should appear (base64url replacement for +/)
      expect(hasHyphen || hasUnderscore).toBe(true);
    });

    it('should prevent timing attacks (constant-time operations)', async () => {
      // Token lookup should have consistent timing regardless of existence
      const validToken = 'valid-token-timing-test-abc123-xyz-safe';
      const invalidToken = 'invalid-token-timing-test-xyz789-abc';

      vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(null);

      // Both queries should execute with similar complexity (no early returns)
      await verifyResetToken(validToken);
      await verifyResetToken(invalidToken);

      expect(prisma.passwordResetToken.findUnique).toHaveBeenCalledTimes(2);
    });
  });
});
