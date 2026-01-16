/**
 * Get Account By ID Procedure
 *
 * Retrieves a single financial account by ID.
 * Ensures the account belongs to the authenticated user (user scoped).
 */

import { TRPCError } from '@trpc/server';

import type { Context } from '@/server/api/trpc';
import type { GetAccountByIdInput } from '../schemas';

/**
 * Get a single account by ID
 *
 * @param ctx - tRPC context with session and db (from protectedProcedure)
 * @param input - Input containing account ID
 * @returns Account details
 * @throws NOT_FOUND if account doesn't exist or doesn't belong to user
 */
export async function getAccountById(
  ctx: Context & { session: NonNullable<Context['session']> },
  input: GetAccountByIdInput
) {
  const userId = ctx.session.user.id;

  // Fetch the account, ensuring it belongs to the user and isn't deleted
  const account = await ctx.db.financialAccount.findUnique({
    where: {
      id: input.id,
    },
  });

  // Check if account exists
  if (!account) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Cuenta no encontrada',
    });
  }

  // Check if account belongs to the user
  if (account.userId !== userId) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Cuenta no encontrada',
    });
  }

  // Check if account is soft-deleted
  if (account.deletedAt) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Cuenta no encontrada',
    });
  }

  return account;
}
