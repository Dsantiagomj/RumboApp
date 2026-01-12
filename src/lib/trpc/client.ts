/**
 * Vanilla tRPC client
 *
 * This is a standalone client that can be used in server components,
 * server actions, or anywhere you need to call tRPC procedures without React hooks.
 */

import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';

import type { AppRouter } from '@/server/api/root';

/**
 * Get base URL for tRPC requests
 */
function getBaseUrl() {
  if (typeof window !== 'undefined') {
    // Browser: use relative URL
    return '';
  }

  if (process.env.VERCEL_URL) {
    // Vercel: use VERCEL_URL environment variable
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development: assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

/**
 * Vanilla tRPC client
 *
 * Usage (server-side):
 * ```ts
 * import { trpcClient } from '@/lib/trpc/client';
 *
 * const health = await trpcClient.health.query();
 * // Result: { status: 'ok', timestamp: Date }
 * ```
 */
export const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
