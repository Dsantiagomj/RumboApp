/**
 * Role-Based Access Control (RBAC) Middleware
 *
 * Provides middleware for checking user roles and creating
 * admin-only procedures in tRPC.
 *
 * Security: OWASP A01:2021 - Broken Access Control
 */

import { TRPCError } from '@trpc/server';

import { t } from '../trpc';

/**
 * Middleware: Enforce user is authenticated
 *
 * This middleware checks if a user is authenticated by verifying
 * the presence of session and session.user in the context.
 *
 * Security Notes:
 * - Throws UNAUTHORIZED (401) if no session exists
 * - Must run before role checks
 * - Does not check user roles, only authentication
 *
 * @throws {TRPCError} UNAUTHORIZED if user is not authenticated
 */
export const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  return next({
    ctx: {
      // Infer session.user as non-nullable for downstream procedures
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Middleware: Enforce user is admin
 *
 * This middleware checks if the authenticated user has admin role.
 * Must be used after enforceUserIsAuthed middleware.
 *
 * Security Notes:
 * - Requires authenticated user (session.user must exist)
 * - Checks session.user.role === 'ADMIN'
 * - Throws FORBIDDEN (403) if user is not admin
 * - Consistent error message (no user enumeration)
 *
 * Performance: <1ms execution time
 *
 * @throws {TRPCError} FORBIDDEN if user is not an admin
 */
export const enforceUserIsAdmin = t.middleware(({ ctx, next }) => {
  // Type guard: ensure user exists (should be guaranteed by enforceUserIsAuthed)
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
    });
  }

  // Check admin role
  if (ctx.session.user.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }

  return next({
    ctx: {
      // Pass through the authenticated admin user
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Admin Procedure
 *
 * A tRPC procedure that requires the user to be authenticated AND
 * have admin role. Combines both authentication and authorization checks.
 *
 * Usage:
 * ```ts
 * export const adminRouter = createTRPCRouter({
 *   deleteUser: adminProcedure
 *     .input(z.object({ userId: z.string() }))
 *     .mutation(async ({ ctx, input }) => {
 *       // ctx.session.user is guaranteed to exist and be admin
 *       return await ctx.db.user.delete({
 *         where: { id: input.userId },
 *       });
 *     }),
 * });
 * ```
 *
 * Security:
 * - User must be authenticated (enforceUserIsAuthed)
 * - User must have ADMIN role (enforceUserIsAdmin)
 * - ctx.session.user is typed as non-nullable
 * - ctx.session.user.role is guaranteed to be 'ADMIN'
 */
export const adminProcedure = t.procedure.use(enforceUserIsAuthed).use(enforceUserIsAdmin);
