import NextAuth from 'next-auth';

import { authConfig } from './config';

/**
 * NextAuth v5 instance
 *
 * Usage:
 * - Server Components: const session = await auth()
 * - API Routes: const session = await auth()
 * - Actions: await signIn(), await signOut()
 */

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/**
 * Type-safe auth helper for getting current user
 *
 * @returns User object if authenticated, null otherwise
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Type-safe auth helper for requiring authentication
 *
 * @throws Error if user is not authenticated
 * @returns User object
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized - Authentication required');
  }
  return user;
}

/**
 * Check if user is an admin
 *
 * @returns True if user is authenticated and has ADMIN role
 */
export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === 'ADMIN';
}
