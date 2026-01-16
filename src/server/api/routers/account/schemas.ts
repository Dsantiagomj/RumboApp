/**
 * Zod schemas for Account router
 *
 * Validation schemas for financial account operations.
 */

import { z } from 'zod';

/**
 * Account type enum matching Prisma schema
 */
export const accountTypeSchema = z.enum(
  ['SAVINGS', 'CHECKING', 'CREDIT_CARD', 'LOAN', 'CASH', 'INVESTMENT', 'OTHER'],
  {
    errorMap: () => ({ message: 'Tipo de cuenta inválido' }),
  }
);

/**
 * Create account input schema
 *
 * Validates all inputs for creating a new financial account.
 * Different account types require different fields.
 */
export const createAccountSchema = z.object({
  // Basic info
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede tener más de 100 caracteres'),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(), // Last 4 digits
  accountType: accountTypeSchema,
  currency: z.string().default('COP'),

  // Appearance
  color: z.string().default('#6366f1'),
  icon: z.string().optional(),

  // Balance fields (for SAVINGS, CHECKING, CASH, INVESTMENT)
  currentBalance: z.number().optional(),

  // Credit card fields
  creditLimit: z.number().optional(),
  currentDebt: z.number().optional(),

  // Loan fields
  loanAmount: z.number().optional(),
  remainingLoanBalance: z.number().optional(),
  monthlyPayment: z.number().optional(),
});

/**
 * Type inference for createAccountSchema
 */
export type CreateAccountInput = z.infer<typeof createAccountSchema>;

/**
 * Get account by ID input schema
 */
export const getAccountByIdSchema = z.object({
  id: z.string().min(1, 'El ID de la cuenta es obligatorio'),
});

/**
 * Type inference for getAccountByIdSchema
 */
export type GetAccountByIdInput = z.infer<typeof getAccountByIdSchema>;

/**
 * Account output schema
 *
 * What we return from queries.
 * Excludes deletedAt field.
 */
export const accountOutputSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  bankName: z.string().nullable(),
  accountNumber: z.string().nullable(),
  accountType: accountTypeSchema,
  currency: z.string(),
  color: z.string(),
  icon: z.string().nullable(),
  initialBalance: z.number(),
  currentBalance: z.number(),
  creditLimit: z.number().nullable(),
  availableCredit: z.number().nullable(),
  loanAmount: z.number().nullable(),
  remainingBalance: z.number().nullable(),
  monthlyPayment: z.number().nullable(),
  isManual: z.boolean(),
  lastSyncedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Type inference for accountOutputSchema
 */
export type AccountOutput = z.infer<typeof accountOutputSchema>;
