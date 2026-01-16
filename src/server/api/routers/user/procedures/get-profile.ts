/**
 * Get Profile Procedure
 *
 * Retrieves the current authenticated user's profile.
 * Uses session.user.id to fetch user data.
 * Excludes sensitive fields (password, deletedAt).
 */

import { TRPCError } from '@trpc/server';

import type { Context } from '@/server/api/trpc';

/**
 * Get current user profile
 *
 * @param ctx - tRPC context with session and db (from protectedProcedure)
 * @returns User profile without sensitive fields
 * @throws UNAUTHORIZED if session is missing
 * @throws NOT_FOUND if user is not found
 */
export async function getProfile(ctx: Context & { session: NonNullable<Context['session']> }) {
  // Session is guaranteed to exist by protectedProcedure
  const userId = ctx.session.user.id;

  // Fetch user with explicit field selection (type-safe)
  const user = await ctx.db.user.findUnique({
    where: {
      id: userId,
      deletedAt: null, // Exclude soft-deleted users
    },
    select: {
      id: true,
      email: true,
      emailVerified: true,
      name: true,
      image: true,
      nickname: true,
      colombianId: true,
      colombianIdType: true,
      role: true,
      currency: true,
      locale: true,
      timezone: true,
      theme: true,
      createdAt: true,
      updatedAt: true,
      // Explicitly exclude sensitive fields
      password: false,
      deletedAt: false,
    },
  });

  // User should exist if session is valid, but handle edge case
  if (!user) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'User not found. Your session may be invalid.',
    });
  }

  return user;
}
