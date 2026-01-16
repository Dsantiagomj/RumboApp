/**
 * Row-Level Security (RLS) Middleware
 *
 * Provides middleware for validating resource ownership in tRPC procedures.
 * Implements row-level security by ensuring users can only access their own data.
 *
 * Security: OWASP A01:2021 - Broken Access Control
 *           Implements Principle of Least Privilege
 */

import { TRPCError } from '@trpc/server';

import type { Context } from '../trpc';

import { t } from '../trpc';

/**
 * Generic Resource Ownership Validator
 *
 * Creates a middleware that validates if the current user owns a resource.
 * This is the foundation for implementing row-level security in tRPC.
 *
 * Security Notes:
 * - Requires authenticated user (session.user must exist)
 * - Validates userId matches session.user.id
 * - Throws FORBIDDEN (403) if ownership check fails
 * - Consistent error messages (no information leakage)
 * - Performance: <5ms execution time
 *
 * @param getUserId - Function that extracts userId from the procedure input
 * @returns Middleware that validates ownership
 *
 * @throws {TRPCError} UNAUTHORIZED if user is not authenticated
 * @throws {TRPCError} FORBIDDEN if user doesn't own the resource
 *
 * @example
 * ```ts
 * // Validate transaction ownership
 * const transactionOwnershipMiddleware = enforceResourceOwnership(
 *   (input: { transactionId: string }) => input.transactionId
 * );
 *
 * export const transactionRouter = createTRPCRouter({
 *   update: protectedProcedure
 *     .use(transactionOwnershipMiddleware)
 *     .input(z.object({
 *       transactionId: z.string(),
 *       amount: z.number(),
 *     }))
 *     .mutation(async ({ ctx, input }) => {
 *       // User ownership is guaranteed here
 *       return await ctx.db.transaction.update({
 *         where: { id: input.transactionId },
 *         data: { amount: input.amount },
 *       });
 *     }),
 * });
 * ```
 */
export const enforceResourceOwnership = <TInput extends Record<string, unknown>>(
  getUserId: (input: TInput) => string | undefined | null
) => {
  return t.middleware(async ({ ctx, getRawInput, next }) => {
    // Ensure user is authenticated
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Get the raw input (before parsing/validation)
    const rawInput = await getRawInput();

    // Extract resource userId using the provided function
    const resourceUserId = getUserId(rawInput as TInput);

    // Validate userId exists in input
    if (!resourceUserId) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Resource identifier required',
      });
    }

    // Validate ownership: resource userId must match session userId
    if (resourceUserId !== ctx.session.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Access denied',
      });
    }

    // Ownership validated, proceed to next middleware/procedure
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
};

/**
 * Enforces that a userId in the input matches the authenticated user's ID
 *
 * This is a convenience wrapper around enforceResourceOwnership for the
 * common case where the input directly contains a userId field.
 *
 * Security Notes:
 * - Validates input.userId === session.user.id
 * - Throws FORBIDDEN if IDs don't match
 * - Use for create/update operations with explicit userId
 *
 * @example
 * ```ts
 * export const accountRouter = createTRPCRouter({
 *   create: protectedProcedure
 *     .use(enforceUserIdMatch)
 *     .input(z.object({
 *       userId: z.string(),
 *       name: z.string(),
 *       accountType: z.enum(['SAVINGS', 'CHECKING']),
 *     }))
 *     .mutation(async ({ ctx, input }) => {
 *       // userId is guaranteed to match authenticated user
 *       return await ctx.db.financialAccount.create({
 *         data: input,
 *       });
 *     }),
 * });
 * ```
 */
export const enforceUserIdMatch = enforceResourceOwnership<{ userId: string }>(
  (input) => input.userId
);

/**
 * Database-based Ownership Validator
 *
 * Creates a middleware that validates ownership by querying the database.
 * Use this when the userId is not directly in the input, but can be
 * retrieved from the database.
 *
 * Security Notes:
 * - Requires database query (higher latency ~10-50ms)
 * - Validates database record userId matches session.user.id
 * - Throws FORBIDDEN if resource not found or ownership fails
 * - Prevents information leakage (same error for not found vs not owned)
 *
 * @param fetchUserId - Async function that queries DB and returns userId
 * @returns Middleware that validates ownership via database
 *
 * @throws {TRPCError} UNAUTHORIZED if user is not authenticated
 * @throws {TRPCError} FORBIDDEN if resource not found or not owned
 *
 * @example
 * ```ts
 * export const transactionRouter = createTRPCRouter({
 *   delete: protectedProcedure
 *     .use(
 *       enforceOwnershipViaDb(async (ctx, input: { id: string }) => {
 *         const transaction = await ctx.db.transaction.findUnique({
 *           where: { id: input.id },
 *           select: { userId: true },
 *         });
 *         return transaction?.userId;
 *       })
 *     )
 *     .input(z.object({ id: z.string() }))
 *     .mutation(async ({ ctx, input }) => {
 *       // Ownership is guaranteed
 *       return await ctx.db.transaction.delete({
 *         where: { id: input.id },
 *       });
 *     }),
 * });
 * ```
 */
export const enforceOwnershipViaDb = <TInput extends Record<string, unknown>>(
  fetchUserId: (ctx: Context, input: TInput) => Promise<string | undefined | null>
) => {
  return t.middleware(async ({ ctx, getRawInput, next }) => {
    // Ensure user is authenticated
    if (!ctx.session?.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      });
    }

    // Get the raw input (before parsing/validation)
    const rawInput = await getRawInput();

    // Fetch resource userId from database
    const resourceUserId = await fetchUserId(ctx, rawInput as TInput);

    // Resource not found OR not owned (same error for security)
    if (!resourceUserId || resourceUserId !== ctx.session.user.id) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Access denied',
      });
    }

    // Ownership validated, proceed
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
};
