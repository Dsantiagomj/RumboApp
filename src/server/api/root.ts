/**
 * Root tRPC router
 *
 * All routers are combined here to create the main app router.
 * Add new feature routers here as they're created.
 */

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';
import { authRouter } from '@/server/api/routers/auth';
import { userRouter } from '@/server/api/routers/user';

/**
 * App Router
 *
 * This is the main router that combines all feature routers.
 * Currently includes:
 * - authRouter: Authentication (register, login, logout)
 * - userRouter: User management
 *
 * Future routers:
 * - transactionRouter
 * - budgetRouter
 * - billRouter
 * - accountRouter
 * - aiRouter
 */
export const appRouter = createTRPCRouter({
  /**
   * Health check endpoint
   *
   * Usage:
   * ```ts
   * const { data } = trpc.health.useQuery();
   * // data: { status: 'ok', timestamp: Date }
   * ```
   */
  health: publicProcedure.query(() => {
    return {
      status: 'ok' as const,
      timestamp: new Date(),
    };
  }),

  // Feature routers
  auth: authRouter,
  user: userRouter,

  // Future routers will be added here:
  // transaction: transactionRouter,
  // budget: budgetRouter,
  // bill: billRouter,
  // account: accountRouter,
  // ai: aiRouter,
});

/**
 * Export type definition of the app router
 * This is used by the tRPC client for type inference
 */
export type AppRouter = typeof appRouter;
