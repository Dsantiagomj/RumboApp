/**
 * Account Router
 *
 * Handles financial account operations:
 * - create: Create a new financial account
 * - list: List all user's accounts
 * - getById: Get a single account by ID
 *
 * All procedures require authentication (protectedProcedure).
 */

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';

import { createAccountSchema, getAccountByIdSchema } from './schemas';
import { createAccount } from './procedures/create';
import { listAccounts } from './procedures/list';
import { getAccountById } from './procedures/get-by-id';

/**
 * Account Router
 *
 * @example Frontend usage:
 * ```tsx
 * // Create account
 * const createMutation = trpc.account.create.useMutation();
 * await createMutation.mutateAsync({
 *   name: 'Bancolombia Ahorros',
 *   bankName: 'Bancolombia',
 *   accountType: 'SAVINGS',
 *   currentBalance: 1000000,
 * });
 *
 * // List accounts
 * const { data: accounts } = trpc.account.list.useQuery();
 *
 * // Get account by ID
 * const { data: account } = trpc.account.getById.useQuery({ id: 'account_id' });
 * ```
 */
export const accountRouter = createTRPCRouter({
  /**
   * Create a new financial account
   *
   * @input CreateAccountInput - Account details
   * @returns Created account
   * @throws UNAUTHORIZED if not logged in
   * @throws BAD_REQUEST if validation fails
   */
  create: protectedProcedure.input(createAccountSchema).mutation(({ ctx, input }) => {
    return createAccount(ctx, input);
  }),

  /**
   * List all user's financial accounts
   *
   * @returns Array of accounts (excludes soft-deleted, ordered by createdAt desc)
   * @throws UNAUTHORIZED if not logged in
   */
  list: protectedProcedure.query(({ ctx }) => {
    return listAccounts(ctx);
  }),

  /**
   * Get a single account by ID
   *
   * @input GetAccountByIdInput - Account ID
   * @returns Account details
   * @throws UNAUTHORIZED if not logged in
   * @throws NOT_FOUND if account doesn't exist or doesn't belong to user
   */
  getById: protectedProcedure.input(getAccountByIdSchema).query(({ ctx, input }) => {
    return getAccountById(ctx, input);
  }),
});
