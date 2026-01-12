/**
 * tRPC API route handler
 *
 * This handles all tRPC requests at /api/trpc/*
 * All tRPC procedures are accessible through this endpoint.
 *
 * Examples:
 * - GET /api/trpc/health (health check)
 * - POST /api/trpc/user.getProfile (get user profile)
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

/**
 * Configure request handler
 */
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      process.env.NODE_ENV === 'development'
        ? ({ path, error }) => {
            console.error(`❌ tRPC failed on ${path ?? '<no-path>'}:`, error.message);
          }
        : undefined,
  });

export { handler as GET, handler as POST };
