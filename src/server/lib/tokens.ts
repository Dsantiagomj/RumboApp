/**
 * Token generation and validation utilities
 *
 * This module provides secure token generation for password reset flows.
 * Tokens are:
 * - Cryptographically secure (using Node.js crypto.randomBytes)
 * - URL-safe (base64url encoding)
 * - Time-limited (1 hour expiration)
 * - Single-use (deleted after successful reset)
 */

import { randomBytes } from 'node:crypto';

import type { PasswordResetToken } from '@prisma/client';

import { prisma } from '@/server/db';

/**
 * Token expiration time in milliseconds (1 hour)
 */
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a secure random token for password reset
 *
 * @returns URL-safe base64-encoded token (43 characters)
 *
 * @example
 * ```ts
 * const token = generateResetToken();
 * // Returns: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v"
 * ```
 */
export function generateResetToken(): string {
  // Generate 32 random bytes for cryptographic security
  const buffer = randomBytes(32);

  // Convert to URL-safe base64 string (remove padding and make URL-safe)
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Create a password reset token for a user
 *
 * @param userId - The user's ID
 * @returns The created token record
 *
 * @example
 * ```ts
 * const tokenRecord = await createResetToken('user_123');
 * // Send tokenRecord.token via email
 * ```
 */
export async function createResetToken(userId: string): Promise<PasswordResetToken> {
  const token = generateResetToken();
  const expires = new Date(Date.now() + TOKEN_EXPIRY_MS);

  // Delete any existing tokens for this user before creating a new one
  await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  // Create new token
  return prisma.passwordResetToken.create({
    data: {
      userId,
      token,
      expires,
    },
  });
}

/**
 * Verify a password reset token and return the associated user ID
 *
 * @param token - The reset token to verify
 * @returns Object with user ID and expiration status, or null if invalid
 *
 * @example
 * ```ts
 * const result = await verifyResetToken('abc123...');
 * if (!result) {
 *   throw new Error('Invalid or expired token');
 * }
 * if (result.isExpired) {
 *   throw new Error('Token has expired');
 * }
 * // Use result.userId to reset password
 * ```
 */
export async function verifyResetToken(
  token: string
): Promise<{ userId: string; isExpired: boolean } | null> {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    return null;
  }

  const isExpired = resetToken.expires < new Date();

  return {
    userId: resetToken.userId,
    isExpired,
  };
}

/**
 * Delete all password reset tokens for a user
 *
 * This should be called after a successful password reset to invalidate
 * all existing tokens for the user.
 *
 * @param userId - The user's ID
 * @returns Number of tokens deleted
 *
 * @example
 * ```ts
 * await invalidateUserTokens('user_123');
 * // All reset tokens for this user are now deleted
 * ```
 */
export async function invalidateUserTokens(userId: string): Promise<number> {
  const result = await prisma.passwordResetToken.deleteMany({
    where: { userId },
  });

  return result.count;
}

/**
 * Delete expired tokens (cleanup utility)
 *
 * This can be called periodically to clean up expired tokens from the database.
 *
 * @returns Number of tokens deleted
 *
 * @example
 * ```ts
 * const deleted = await cleanupExpiredTokens();
 * console.error(`Cleaned up ${deleted} expired tokens`);
 * ```
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.passwordResetToken.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  });

  return result.count;
}
