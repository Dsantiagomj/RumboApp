/**
 * Reset Password Procedure
 *
 * This procedure handles password reset completion by:
 * 1. Verifying the reset token
 * 2. Validating password strength
 * 3. Updating the user's password
 * 4. Invalidating all reset tokens for the user
 * 5. Sending a confirmation email
 *
 * SECURITY:
 * - Tokens are verified for existence and expiration
 * - Password strength requirements enforced (OWASP compliant)
 * - All user tokens invalidated after successful reset
 * - Argon2id used for password hashing
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { hashPassword } from '@/server/auth/argon2';
import { sendPasswordChangedEmail } from '@/server/lib/email';
import { invalidateUserTokens, verifyResetToken } from '@/server/lib/tokens';

/**
 * Password validation regex
 *
 * Requirements:
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - Optional: special characters
 */
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/**
 * Input validation schema
 */
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      PASSWORD_REGEX,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
});

/**
 * Reset password procedure
 *
 * @example
 * ```ts
 * const result = await trpc.auth.resetPassword.mutate({
 *   token: 'abc123...',
 *   newPassword: 'NewSecurePass123'
 * });
 * // result: { success: true, message: '...' }
 * ```
 */
export const resetPasswordProcedure = publicProcedure
  .input(resetPasswordSchema)
  .mutation(async ({ input, ctx }) => {
    const { token, newPassword } = input;

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
        await ctx.db.passwordResetToken.delete({
          where: { token },
        });

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Reset link has expired. Please request a new password reset.',
        });
      }

      // Get user details
      const user = await ctx.db.user.findUnique({
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
      await ctx.db.user.update({
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
  });
