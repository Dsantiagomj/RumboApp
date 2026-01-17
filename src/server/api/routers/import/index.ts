import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { ImportJobStatus } from '@prisma/client';

/**
 * Import Router
 *
 * Handles import job status tracking and confirmation
 * Used by the import wizard UI
 */

export const importRouter = createTRPCRouter({
  /**
   * Get import job status
   * Polls for job progress and results
   */
  getStatus: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const job = await ctx.db.importJob.findUnique({
        where: {
          id: input.jobId,
          userId: ctx.session.user.id,
        },
        include: {
          importedAccounts: {
            include: {
              transactions: {
                orderBy: {
                  date: 'desc',
                },
                take: 100, // Limit transactions for performance
              },
            },
          },
        },
      });

      if (!job) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Import job not found',
        });
      }

      return {
        id: job.id,
        status: job.status,
        progress: job.progress,
        error: job.error,
        fileName: job.fileName,
        fileType: job.fileType,
        bankFormat: job.bankFormat,
        accountsCount: job.accountsCount,
        transactionsCount: job.transactionsCount,
        completedAt: job.completedAt,
        accounts: job.importedAccounts.map((account) => ({
          id: account.id,
          name: account.name,
          bankName: account.bankName,
          accountNumber: account.accountNumber,
          accountType: account.accountType,
          initialBalance: account.initialBalance.toNumber(),
          transactionCount: account.transactionCount,
          suggestedColor: account.suggestedColor,
          suggestedIcon: account.suggestedIcon,
          confidence: account.confidence,
          isConfirmed: account.isConfirmed,
          transactions: account.transactions.map((tx) => ({
            id: tx.id,
            date: tx.date,
            description: tx.description,
            amount: tx.amount.toNumber(),
            type: tx.type,
            merchant: tx.merchant,
            suggestedCategoryId: tx.suggestedCategoryId,
            confidence: tx.confidence,
            isConfirmed: tx.isConfirmed,
          })),
        })),
      };
    }),

  /**
   * Confirm import and create real accounts/transactions
   * Moves data from ImportedAccount/ImportedTransaction to FinancialAccount/Transaction
   */
  confirmImport: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
        accountConfirmations: z.array(
          z.object({
            importedAccountId: z.string(),
            confirmed: z.boolean(),
            // Allow user to modify account details before confirming
            name: z.string().optional(),
            accountType: z
              .enum(['SAVINGS', 'CHECKING', 'CREDIT_CARD', 'LOAN', 'CASH', 'INVESTMENT', 'OTHER'])
              .optional(),
            color: z.string().optional(),
            icon: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify job belongs to user and is in REVIEW status
      const job = await ctx.db.importJob.findUnique({
        where: {
          id: input.jobId,
          userId: ctx.session.user.id,
        },
        include: {
          importedAccounts: {
            include: {
              transactions: true,
            },
          },
        },
      });

      if (!job) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Import job not found',
        });
      }

      if (job.status !== ImportJobStatus.REVIEW) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Cannot confirm import in ${job.status} status. Must be in REVIEW status.`,
        });
      }

      const createdAccounts: string[] = [];
      const createdTransactions: number[] = [];

      // Process each account confirmation
      for (const confirmation of input.accountConfirmations) {
        if (!confirmation.confirmed) {
          continue; // Skip unconfirmed accounts
        }

        const importedAccount = job.importedAccounts.find(
          (acc) => acc.id === confirmation.importedAccountId
        );

        if (!importedAccount) {
          continue;
        }

        // Create real FinancialAccount
        const financialAccount = await ctx.db.financialAccount.create({
          data: {
            userId: ctx.session.user.id,
            name: confirmation.name || importedAccount.name,
            bankName: importedAccount.bankName,
            accountNumber: importedAccount.accountNumber,
            accountType: confirmation.accountType || importedAccount.accountType,
            currency: 'COP',
            color: confirmation.color || importedAccount.suggestedColor || '#6366f1',
            icon: confirmation.icon || importedAccount.suggestedIcon,
            initialBalance: importedAccount.initialBalance,
            currentBalance: importedAccount.initialBalance,
            isManual: false,
            lastSyncedAt: new Date(),
          },
        });

        createdAccounts.push(financialAccount.id);

        // Create real Transactions
        const transactionData = importedAccount.transactions.map((tx) => ({
          userId: ctx.session.user.id,
          accountId: financialAccount.id,
          date: tx.date,
          description: tx.description,
          amount: tx.amount,
          type: tx.type,
          merchant: tx.merchant,
          categoryId: tx.suggestedCategoryId,
          status: 'CLEARED' as const,
        }));

        if (transactionData.length > 0) {
          const result = await ctx.db.transaction.createMany({
            data: transactionData,
          });
          createdTransactions.push(result.count);
        }

        // Update ImportedAccount as confirmed
        await ctx.db.importedAccount.update({
          where: { id: importedAccount.id },
          data: {
            isConfirmed: true,
            confirmedAccountId: financialAccount.id,
          },
        });
      }

      // Update ImportJob status to CONFIRMED
      await ctx.db.importJob.update({
        where: { id: input.jobId },
        data: {
          status: ImportJobStatus.CONFIRMED,
        },
      });

      return {
        success: true,
        accountsCreated: createdAccounts.length,
        transactionsCreated: createdTransactions.reduce((sum, count) => sum + count, 0),
      };
    }),

  /**
   * Cancel import and delete all imported data
   */
  cancelImport: protectedProcedure
    .input(
      z.object({
        jobId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify job belongs to user
      const job = await ctx.db.importJob.findUnique({
        where: {
          id: input.jobId,
          userId: ctx.session.user.id,
        },
      });

      if (!job) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Import job not found',
        });
      }

      // Delete all imported data (cascade will handle transactions)
      await ctx.db.importedAccount.deleteMany({
        where: {
          importJobId: input.jobId,
        },
      });

      // Update job status to CANCELLED
      await ctx.db.importJob.update({
        where: { id: input.jobId },
        data: {
          status: ImportJobStatus.CANCELLED,
        },
      });

      return {
        success: true,
      };
    }),
});
