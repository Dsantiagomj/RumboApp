/**
 * User Router
 *
 * Handles user profile operations:
 * - getProfile: Retrieve current user's profile
 * - updateProfile: Update current user's profile
 *
 * All procedures require authentication (protectedProcedure).
 */

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { updateProfileSchema } from './schemas';
import { getProfile } from './procedures/get-profile';
import { updateProfile } from './procedures/update-profile';

/**
 * User Router
 *
 * @example Frontend usage:
 * ```tsx
 * // Get profile
 * const { data: profile } = trpc.user.getProfile.useQuery();
 *
 * // Update profile
 * const updateMutation = trpc.user.updateProfile.useMutation();
 * await updateMutation.mutateAsync({ name: 'Juan Pérez' });
 * ```
 */
export const userRouter = createTRPCRouter({
  /**
   * Get current user's profile
   *
   * @returns User profile without sensitive fields (password, deletedAt)
   * @throws UNAUTHORIZED if not logged in
   * @throws NOT_FOUND if user not found
   */
  getProfile: protectedProcedure.query(({ ctx }) => {
    return getProfile(ctx);
  }),

  /**
   * Update current user's profile
   *
   * @input UpdateProfileInput - Partial user data to update
   * @returns Updated user profile
   * @throws UNAUTHORIZED if not logged in
   * @throws CONFLICT if email is taken
   * @throws BAD_REQUEST if validation fails
   * @throws NOT_FOUND if user not found
   */
  updateProfile: protectedProcedure.input(updateProfileSchema).mutation(({ ctx, input }) => {
    return updateProfile(ctx, input);
  }),
});
