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

import { z } from 'zod';

import { publicProcedure } from '@/server/api/trpc';

import { requestPasswordReset } from './request-password-reset-logic';

/**
 * Input validation schema
 */
const requestPasswordResetSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address').toLowerCase().trim(),
});

/**
 * Request password reset input type
 */
export type RequestPasswordResetInput = z.infer<typeof requestPasswordResetSchema>;

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
    return requestPasswordReset(input.email, ctx.db);
  });
