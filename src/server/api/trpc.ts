/**
 * tRPC initialization and configuration
 *
 * This file:
 * 1. Creates the tRPC context (session, db, headers)
 * 2. Initializes tRPC with SuperJSON transformer
 * 3. Defines public and protected procedures
 * 4. Exports reusable procedure builders
 */

import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';

import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

import { auth } from '@/server/auth';
import { prisma } from '@/server/db';

/**
 * Create tRPC context
 *
 * This runs for every tRPC request and provides:
 * - session: User session from NextAuth
 * - db: Prisma client instance
 * - headers: Request headers
 */
export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
  const session = await auth();

  return {
    session,
    db: prisma,
    headers: opts.req.headers,
  };
};

/**
 * Context type helper
 * Inferred from createTRPCContext return type
 */
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

/**
 * Initialize tRPC with configuration
 */
const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create tRPC router
 * Use this to create new routers
 */
export const createTRPCRouter = t.router;

/**
 * Middleware: Check if user is authenticated
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      // Infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/**
 * Public procedure
 * Anyone can call these procedures (no authentication required)
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure
 * Requires user to be authenticated (session must exist)
 *
 * Usage:
 * ```ts
 * export const userRouter = createTRPCRouter({
 *   getProfile: protectedProcedure.query(({ ctx }) => {
 *     return ctx.db.user.findUnique({
 *       where: { id: ctx.session.user.id },
 *     });
 *   }),
 * });
 * ```
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

/**
 * Export tRPC instance for middleware creation
 * Used by middleware modules to create type-safe middleware
 */
export { t };

/**
 * Re-export middleware from middleware module
 * Provides RBAC (Role-Based Access Control) and RLS (Row-Level Security)
 *
 * Available exports:
 * - adminProcedure: Procedure for admin-only routes
 * - enforceUserIsAdmin: Admin role check middleware
 * - enforceResourceOwnership: Generic ownership validation
 * - enforceUserIdMatch: Validates userId in input
 * - enforceOwnershipViaDb: Database-based ownership validation
 */
export {
  adminProcedure,
  enforceUserIsAdmin,
  enforceResourceOwnership,
  enforceUserIdMatch,
  enforceOwnershipViaDb,
} from './middleware';
