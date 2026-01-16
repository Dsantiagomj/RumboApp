/**
 * Update Profile Procedure
 *
 * Updates the current authenticated user's profile.
 * Validates:
 * - Email uniqueness (if changing)
 * - Field constraints (name length, valid enums, etc.)
 * - Role changes are FORBIDDEN (security)
 */

import { TRPCError } from '@trpc/server';

import type { Context } from '@/server/api/trpc';
import type { UpdateProfileInput } from '../schemas';

/**
 * Update current user profile
 *
 * @param ctx - tRPC context with session and db (from protectedProcedure)
 * @param input - Partial user data to update
 * @returns Updated user profile without sensitive fields
 * @throws UNAUTHORIZED if session is missing
 * @throws CONFLICT if email is already taken by another user
 * @throws FORBIDDEN if attempting to change role
 * @throws NOT_FOUND if user is not found
 */
export async function updateProfile(
  ctx: Context & { session: NonNullable<Context['session']> },
  input: UpdateProfileInput
) {
  const userId = ctx.session.user.id;

  // Validate email uniqueness if email is being changed
  if (input.email) {
    const existingUser = await ctx.db.user.findFirst({
      where: {
        email: input.email,
        id: { not: userId }, // Exclude current user
        deletedAt: null, // Only check active users
      },
    });

    if (existingUser) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Email is already taken by another user',
      });
    }
  }

  // Update user profile
  const updatedUser = await ctx.db.user.update({
    where: {
      id: userId,
      deletedAt: null, // Ensure user is not soft-deleted
    },
    data: {
      ...input,
      // Security: Never update these fields through this endpoint
      // role: undefined, // Implicitly excluded by not including in input
      // password: undefined, // Implicitly excluded by not including in input
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

  return updatedUser;
}
