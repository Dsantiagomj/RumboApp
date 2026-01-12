import { handlers } from '@/server/auth';

/**
 * NextAuth v5 API Route Handler
 *
 * This handles all NextAuth routes:
 * - GET  /api/auth/signin - Sign in page
 * - POST /api/auth/signin/:provider - Sign in with provider
 * - GET  /api/auth/signout - Sign out page
 * - POST /api/auth/signout - Sign out
 * - GET  /api/auth/session - Get session
 * - GET  /api/auth/csrf - Get CSRF token
 * - GET  /api/auth/providers - Get configured providers
 * - GET  /api/auth/callback/:provider - OAuth callback
 */

export const { GET, POST } = handlers;
