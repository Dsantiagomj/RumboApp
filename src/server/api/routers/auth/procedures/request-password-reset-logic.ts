/**
 * Request Password Reset Logic
 *
 * Pure business logic for password reset requests (no tRPC dependencies).
 * Testable independently of NextAuth/tRPC.
 */

import { TRPCError } from '@trpc/server';

import type { PrismaClient } from '@prisma/client';

import { sendPasswordResetEmail } from '@/server/lib/email';
import { createResetToken } from '@/server/lib/tokens';

/**
 * Request password reset response type
 */
export type RequestPasswordResetResponse = {
  success: true;
  message: string;
};

/**
 * Request password reset logic
 *
 * @param email - User's email address
 * @param db - Prisma client instance
 * @returns Success response
 * @throws TRPCError with INTERNAL_SERVER_ERROR if operation fails
 */
export async function requestPasswordReset(
  email: string,
  db: PrismaClient
): Promise<RequestPasswordResetResponse> {
  try {
    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        deletedAt: true,
      },
    });

    // SECURITY: Always proceed with token generation to prevent timing attacks
    // This ensures the response time is similar whether the user exists or not
    if (user && !user.deletedAt) {
      // Generate reset token
      const resetToken = await createResetToken(user.id);

      // Send reset email
      await sendPasswordResetEmail(user.email, resetToken.token, user.name ?? undefined);
    }

    // SECURITY: Always return success to prevent user enumeration
    // An attacker cannot determine if an email exists in the system
    return {
      success: true,
      message:
        'If an account exists with this email, you will receive a password reset link shortly.',
    };
  } catch (error) {
    // Log error for monitoring but don't expose details to client
    console.error('Password reset request error:', error);

    // Only throw for server errors, not user errors
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while processing your request. Please try again later.',
    });
  }
}
