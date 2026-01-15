/**
 * Reset Password Logic
 *
 * Pure business logic for password reset (no tRPC dependencies).
 * Testable independently of NextAuth/tRPC.
 */

import { TRPCError } from '@trpc/server';

import type { PrismaClient } from '@prisma/client';

import { hashPassword } from '@/server/auth/argon2';
import { sendPasswordChangedEmail } from '@/server/lib/email';
import { invalidateUserTokens, verifyResetToken } from '@/server/lib/tokens';

/**
 * Reset password response type
 */
export type ResetPasswordResponse = {
  success: true;
  message: string;
};

/**
 * Reset password logic
 *
 * @param token - Reset token
 * @param newPassword - New password
 * @param db - Prisma client instance
 * @returns Success response
 * @throws TRPCError with appropriate code if operation fails
 */
export async function resetPassword(
  token: string,
  newPassword: string,
  db: PrismaClient
): Promise<ResetPasswordResponse> {
  try {
    // Verify token exists and check expiration
    const tokenData = await verifyResetToken(token);

    if (!tokenData) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid or expired reset token. Please request a new password reset.',
      });
    }

    if (tokenData.isExpired) {
      // Clean up expired token
      await db.passwordResetToken.delete({
        where: { token },
      });

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Reset link has expired. Please request a new password reset.',
      });
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: tokenData.userId },
      select: {
        id: true,
        email: true,
        name: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'User account not found or has been deleted.',
      });
    }

    // Hash new password with Argon2id (OWASP 2024 compliant)
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date(),
      },
    });

    // Invalidate ALL reset tokens for this user (security best practice)
    await invalidateUserTokens(user.id);

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(user.email, user.name ?? undefined);
    } catch (emailError) {
      // Log email error but don't fail the password reset
      console.error('Failed to send password changed email:', emailError);
    }

    return {
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    };
  } catch (error) {
    // Re-throw TRPCError as-is (already formatted)
    if (error instanceof TRPCError) {
      throw error;
    }

    // Log unexpected errors for monitoring
    console.error('Password reset error:', error);

    // Generic error for unexpected failures
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while resetting your password. Please try again later.',
    });
  }
}
