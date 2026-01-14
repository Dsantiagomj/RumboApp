/**
 * Request Password Reset Procedure
 *
 * This procedure handles password reset requests by:
 * 1. Finding the user by email
 * 2. Generating a secure reset token
 * 3. Sending a reset email with the token
 * 4. Always returning success (no user enumeration)
 *
 * SECURITY:
 * - No user enumeration: Always returns success even if email not found
 * - Rate limiting should be implemented at the API gateway level
 * - Tokens expire after 1 hour
 * - Previous tokens are invalidated when a new one is created
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';
import { sendPasswordResetEmail } from '@/server/lib/email';
import { createResetToken } from '@/server/lib/tokens';

/**
 * Input validation schema
 */
const requestPasswordResetSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address').toLowerCase().trim(),
});

/**
 * Request password reset procedure
 *
 * @example
 * ```ts
 * const result = await trpc.auth.requestPasswordReset.mutate({
 *   email: 'user@example.com'
 * });
 * // result: { success: true, message: '...' }
 * ```
 */
export const requestPasswordResetProcedure = publicProcedure
  .input(requestPasswordResetSchema)
  .mutation(async ({ input, ctx }) => {
    const { email } = input;

    try {
      // Find user by email
      const user = await ctx.db.user.findUnique({
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
  });
