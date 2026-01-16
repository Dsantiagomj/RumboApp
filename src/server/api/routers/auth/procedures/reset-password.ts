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

import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

import { resetPassword } from './reset-password-logic';

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
 * Reset password input type
 */
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

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
    return resetPassword(input.token, input.newPassword, ctx.db);
  });
