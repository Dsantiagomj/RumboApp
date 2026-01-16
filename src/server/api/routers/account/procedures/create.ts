/**
 * Create Account Procedure
 *
 * Creates a new financial account for the authenticated user.
 * Handles different account types with specific logic.
 */

import { TRPCError } from '@trpc/server';
import { Decimal } from '@prisma/client/runtime/library';
import type { AccountType } from '@prisma/client';

import type { Context } from '@/server/api/trpc';
import type { CreateAccountInput } from '../schemas';

/**
 * Create a new financial account
 *
 * @param ctx - tRPC context with session and db (from protectedProcedure)
 * @param input - Account creation data
 * @returns Created account
 * @throws BAD_REQUEST if validation fails or account type-specific logic fails
 */
export async function createAccount(
  ctx: Context & { session: NonNullable<Context['session']> },
  input: CreateAccountInput
) {
  const userId = ctx.session.user.id;

  // Prepare base account data
  const accountData: {
    userId: string;
    name: string;
    bankName?: string;
    accountNumber?: string;
    accountType: AccountType;
    currency: string;
    color: string;
    icon?: string;
    initialBalance: Decimal;
    currentBalance: Decimal;
    isManual: boolean;
    creditLimit?: Decimal;
    availableCredit?: Decimal;
    loanAmount?: Decimal;
    remainingBalance?: Decimal;
    monthlyPayment?: Decimal;
  } = {
    userId,
    name: input.name,
    bankName: input.bankName,
    accountNumber: input.accountNumber,
    accountType: input.accountType as AccountType,
    currency: input.currency ?? 'COP',
    color: input.color ?? '#6366f1',
    icon: input.icon,
    initialBalance: new Decimal(0),
    currentBalance: new Decimal(0),
    isManual: true, // All manually created accounts are marked as manual
  };

  // Handle account type-specific logic
  switch (input.accountType) {
    case 'CREDIT_CARD': {
      // Credit cards: validate that we have creditLimit and currentDebt
      if (input.creditLimit === undefined || input.creditLimit === null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El límite de crédito es obligatorio para tarjetas de crédito',
        });
      }

      const creditLimit = new Decimal(input.creditLimit);
      const currentDebt = new Decimal(input.currentDebt ?? 0);

      // Calculate available credit
      const availableCredit = creditLimit.minus(currentDebt);

      // Current balance should be negative (debt)
      const currentBalance = currentDebt.negated();

      accountData.creditLimit = creditLimit;
      accountData.availableCredit = availableCredit;
      accountData.currentBalance = currentBalance;
      accountData.initialBalance = currentBalance;
      break;
    }

    case 'LOAN': {
      // Loans: validate that we have loanAmount
      if (input.loanAmount === undefined || input.loanAmount === null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'El monto del préstamo es obligatorio para préstamos',
        });
      }

      const loanAmount = new Decimal(input.loanAmount);
      const remainingLoanBalance = new Decimal(input.remainingLoanBalance ?? input.loanAmount);
      const monthlyPayment = input.monthlyPayment ? new Decimal(input.monthlyPayment) : undefined;

      // Current balance is negative (remaining debt)
      const currentBalance = remainingLoanBalance.negated();

      accountData.loanAmount = loanAmount;
      accountData.remainingBalance = remainingLoanBalance;
      accountData.monthlyPayment = monthlyPayment;
      accountData.currentBalance = currentBalance;
      accountData.initialBalance = currentBalance;
      break;
    }

    case 'SAVINGS':
    case 'CHECKING':
    case 'CASH':
    case 'INVESTMENT': {
      // For these account types, use the provided current balance
      const currentBalance = new Decimal(input.currentBalance ?? 0);
      accountData.currentBalance = currentBalance;
      accountData.initialBalance = currentBalance;
      break;
    }

    case 'OTHER': {
      // For OTHER type, allow any balance configuration
      const currentBalance = new Decimal(input.currentBalance ?? 0);
      accountData.currentBalance = currentBalance;
      accountData.initialBalance = currentBalance;
      break;
    }

    default: {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Tipo de cuenta no reconocido',
      });
    }
  }

  // Create the account
  const account = await ctx.db.financialAccount.create({
    data: accountData,
  });

  return account;
}
