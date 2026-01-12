'use client';

/**
 * tRPC React hooks integration
 *
 * This provides React hooks for tRPC procedures using TanStack Query.
 * Use these hooks in client components for type-safe API calls.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import { useState } from 'react';
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
 * tRPC React hooks
 *
 * Usage in client components:
 * ```tsx
 * 'use client';
 * import { trpc } from '@/lib/trpc/react';
 *
 * export function MyComponent() {
 *   const { data, isLoading } = trpc.health.useQuery();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   return <div>Status: {data?.status}</div>;
 * }
 * ```
 */
export const trpc = createTRPCReact<AppRouter>();

/**
 * TRPCProvider component
 *
 * Wrap your app with this provider to enable tRPC hooks.
 * This should be used in app/layout.tsx.
 *
 * @param props.children - React children
 */
export function TRPCProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Stale time: 30 seconds
            staleTime: 30 * 1000,
          },
        },
      })
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </trpc.Provider>
  );
}
