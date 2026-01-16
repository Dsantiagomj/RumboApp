/**
 * List Accounts Procedure
 *
 * Retrieves all financial accounts for the authenticated user.
 * Excludes soft-deleted accounts and orders by creation date (newest first).
 */

import type { Context } from '@/server/api/trpc';

/**
 * List all user's financial accounts
 *
 * @param ctx - tRPC context with session and db (from protectedProcedure)
 * @returns Array of user's accounts
 */
export async function listAccounts(ctx: Context & { session: NonNullable<Context['session']> }) {
  const userId = ctx.session.user.id;

  // Fetch all non-deleted accounts for the user
  const accounts = await ctx.db.financialAccount.findMany({
    where: {
      userId,
      deletedAt: null, // Exclude soft-deleted accounts
    },
    orderBy: {
      createdAt: 'desc', // Newest first
    },
  });

  return accounts;
}
