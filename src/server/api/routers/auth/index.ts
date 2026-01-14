/**
 * Auth tRPC router
 *
 * Handles authentication operations:
 * - register: Create new user account (public)
 * - login: Authenticate user credentials (public)
 * - logout: End user session (protected)
 * - requestPasswordReset: Request password reset email (public)
 * - resetPassword: Reset password with token (public)
 */

import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';

import { loginUser } from './procedures/login';
import { logoutUser } from './procedures/logout';
import { registerUser } from './procedures/register';
import { requestPasswordResetProcedure } from './procedures/request-password-reset';
import { resetPasswordProcedure } from './procedures/reset-password';
import { loginSchema, registerSchema } from './schemas';

/**
 * Auth router
 *
 * Exports:
 * - auth.register: Register a new user
 * - auth.login: Login with email and password
 * - auth.logout: Logout the current user
 */
export const authRouter = createTRPCRouter({
  /**
   * Register a new user
   *
   * Public procedure - No authentication required
   *
   * @input registerSchema (email, password, name)
   * @returns User object without password
   * @throws CONFLICT if email already exists
   * @throws BAD_REQUEST if validation fails
   *
   * @example
   * ```ts
   * const user = await trpc.auth.register.mutate({
   *   email: 'user@example.com',
   *   password: 'Test1234!',
   *   name: 'John Doe',
   * });
   * ```
   */
  register: publicProcedure.input(registerSchema).mutation(async ({ ctx, input }) => {
    return registerUser(input, ctx.db);
  }),

  /**
   * Login with email and password
   *
   * Public procedure - No authentication required
   *
   * @input loginSchema (email, password)
   * @returns User object without password
   * @throws UNAUTHORIZED if credentials are invalid
   *
   * @example
   * ```ts
   * const user = await trpc.auth.login.mutate({
   *   email: 'user@example.com',
   *   password: 'Test1234!',
   * });
   * ```
   */
  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    return loginUser(input, ctx.db);
  }),

  /**
   * Logout the current user
   *
   * Protected procedure - Requires authentication
   *
   * @returns Success message
   *
   * @example
   * ```ts
   * const result = await trpc.auth.logout.mutate();
   * // result: { success: true, message: 'Logged out successfully' }
   * ```
   */
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    return logoutUser(ctx.session.user.id);
  }),

  /**
   * Request a password reset email
   *
   * Public procedure - No authentication required
   *
   * @returns Success message (always, to prevent user enumeration)
   * @throws INTERNAL_SERVER_ERROR if email sending fails
   *
   * @example
   * ```ts
   * const result = await trpc.auth.requestPasswordReset.mutate({
   *   email: 'user@example.com'
   * });
   * // result: { success: true, message: 'If an account exists...' }
   * ```
   */
  requestPasswordReset: requestPasswordResetProcedure,

  /**
   * Reset password using a valid token
   *
   * Public procedure - No authentication required
   *
   * @returns Success message
   * @throws BAD_REQUEST if token is invalid or expired
   * @throws INTERNAL_SERVER_ERROR if password update fails
   *
   * @example
   * ```ts
   * const result = await trpc.auth.resetPassword.mutate({
   *   token: 'abc123...',
   *   newPassword: 'NewSecurePass123'
   * });
   * // result: { success: true, message: 'Password has been reset...' }
   * ```
   */
  resetPassword: resetPasswordProcedure,
});
