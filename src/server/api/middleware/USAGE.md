# tRPC Middleware Usage Guide

This guide demonstrates how to use the RBAC (Role-Based Access Control) and RLS (Row-Level Security) middleware in your tRPC procedures.

## Table of Contents

- [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
- [Row-Level Security (RLS)](#row-level-security-rls)
- [Real-World Examples](#real-world-examples)

## Role-Based Access Control (RBAC)

### Admin-Only Procedures

Use `adminProcedure` for routes that require admin access:

```typescript
import { createTRPCRouter, adminProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const adminRouter = createTRPCRouter({
  // Delete any user (admin only)
  deleteUser: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // ctx.session.user is guaranteed to exist and be an admin
      return await ctx.db.user.delete({
        where: { id: input.userId },
      });
    }),

  // Get system statistics (admin only)
  getStats: adminProcedure.query(async ({ ctx }) => {
    const userCount = await ctx.db.user.count();
    const transactionCount = await ctx.db.transaction.count();

    return {
      users: userCount,
      transactions: transactionCount,
    };
  }),
});
```

## Row-Level Security (RLS)

### 1. Direct userId Validation

Use `enforceUserIdMatch` when the input contains a `userId` field that must match the session user:

```typescript
import { createTRPCRouter, protectedProcedure, enforceUserIdMatch } from '@/server/api/trpc';
import { z } from 'zod';

export const accountRouter = createTRPCRouter({
  // Create financial account - userId must match session
  create: protectedProcedure
    .use(enforceUserIdMatch)
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        accountType: z.enum(['SAVINGS', 'CHECKING', 'CREDIT_CARD']),
        initialBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // User can only create accounts for themselves
      return await ctx.db.financialAccount.create({
        data: input,
      });
    }),
});
```

### 2. Custom Resource Ownership

Use `enforceResourceOwnership` with a custom getter function for flexible ownership checks:

```typescript
import { createTRPCRouter, protectedProcedure, enforceResourceOwnership } from '@/server/api/trpc';
import { z } from 'zod';

export const budgetRouter = createTRPCRouter({
  // Update budget - validate ownership via input
  update: protectedProcedure
    .use(
      enforceResourceOwnership<{ budgetUserId: string; id: string; amount: number }>(
        (input) => input.budgetUserId
      )
    )
    .input(
      z.object({
        id: z.string(),
        budgetUserId: z.string(), // Custom field name
        amount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Ownership validated
      return await ctx.db.budget.update({
        where: { id: input.id },
        data: { amount: input.amount },
      });
    }),
});
```

### 3. Database-Based Ownership

Use `enforceOwnershipViaDb` when you need to query the database to determine ownership:

```typescript
import { createTRPCRouter, protectedProcedure, enforceOwnershipViaDb } from '@/server/api/trpc';
import { z } from 'zod';

export const transactionRouter = createTRPCRouter({
  // Delete transaction - check ownership in database
  delete: protectedProcedure
    .use(
      enforceOwnershipViaDb(async (ctx, input: { id: string }) => {
        const transaction = await ctx.db.transaction.findUnique({
          where: { id: input.id },
          select: { userId: true },
        });
        return transaction?.userId;
      })
    )
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // User owns this transaction, safe to delete
      return await ctx.db.transaction.delete({
        where: { id: input.id },
      });
    }),

  // Update transaction - check ownership
  update: protectedProcedure
    .use(
      enforceOwnershipViaDb(async (ctx, input: { id: string; amount: number }) => {
        const transaction = await ctx.db.transaction.findUnique({
          where: { id: input.id },
          select: { userId: true },
        });
        return transaction?.userId;
      })
    )
    .input(
      z.object({
        id: z.string(),
        amount: z.number(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.transaction.update({
        where: { id },
        data,
      });
    }),
});
```

## Real-World Examples

### Example 1: Financial Account Management

```typescript
import {
  createTRPCRouter,
  protectedProcedure,
  enforceUserIdMatch,
  enforceOwnershipViaDb,
} from '@/server/api/trpc';
import { z } from 'zod';

export const financialAccountRouter = createTRPCRouter({
  // List user's accounts
  list: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.financialAccount.findMany({
      where: {
        userId: ctx.session.user.id,
        deletedAt: null,
      },
    });
  }),

  // Create account
  create: protectedProcedure
    .use(enforceUserIdMatch)
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        accountType: z.enum(['SAVINGS', 'CHECKING', 'CREDIT_CARD', 'CASH']),
        initialBalance: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.financialAccount.create({
        data: {
          ...input,
          currentBalance: input.initialBalance,
        },
      });
    }),

  // Update account
  update: protectedProcedure
    .use(
      enforceOwnershipViaDb(async (ctx, input: { id: string; name: string }) => {
        const account = await ctx.db.financialAccount.findUnique({
          where: { id: input.id },
          select: { userId: true },
        });
        return account?.userId;
      })
    )
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        color: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.financialAccount.update({
        where: { id },
        data,
      });
    }),

  // Delete account (soft delete)
  delete: protectedProcedure
    .use(
      enforceOwnershipViaDb(async (ctx, input: { id: string }) => {
        const account = await ctx.db.financialAccount.findUnique({
          where: { id: input.id },
          select: { userId: true },
        });
        return account?.userId;
      })
    )
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.financialAccount.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      });
    }),
});
```

### Example 2: Admin User Management

```typescript
import { createTRPCRouter, adminProcedure } from '@/server/api/trpc';
import { z } from 'zod';

export const adminUserRouter = createTRPCRouter({
  // List all users (admin only)
  listAll: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.db.user.findMany({
        take: input.limit,
        skip: (input.page - 1) * input.limit,
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      const total = await ctx.db.user.count();

      return {
        users,
        pagination: {
          page: input.page,
          limit: input.limit,
          total,
          pages: Math.ceil(total / input.limit),
        },
      };
    }),

  // Change user role (admin only)
  changeRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(['USER', 'ADMIN']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.user.update({
        where: { id: input.userId },
        data: { role: input.role },
      });
    }),

  // Permanently delete user (admin only)
  permanentDelete: adminProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Delete user and all related data (cascade)
      return await ctx.db.user.delete({
        where: { id: input.userId },
      });
    }),
});
```

### Example 3: Combining Multiple Middleware

```typescript
import { createTRPCRouter, protectedProcedure, enforceOwnershipViaDb } from '@/server/api/trpc';
import { z } from 'zod';

export const billRouter = createTRPCRouter({
  // Update bill with ownership validation
  update: protectedProcedure
    .use(
      enforceOwnershipViaDb(async (ctx, input: { id: string }) => {
        const bill = await ctx.db.bill.findUnique({
          where: { id: input.id },
          select: { userId: true },
        });
        return bill?.userId;
      })
    )
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        amount: z.number(),
        dueDay: z.number().min(1).max(31),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return await ctx.db.bill.update({
        where: { id },
        data,
      });
    }),
});
```

## Security Best Practices

1. **Always use middleware for sensitive operations** - Never rely on client-side checks alone
2. **Use database-based validation for updates/deletes** - Ensure resource exists and is owned by user
3. **Keep error messages consistent** - Don't leak information about resource existence
4. **Use admin procedures sparingly** - Only for truly administrative operations
5. **Test your authorization** - Write tests for both authorized and unauthorized access

## Error Handling

The middleware throws these tRPC errors:

- `UNAUTHORIZED` (401) - User is not authenticated
- `FORBIDDEN` (403) - User is authenticated but not authorized
- `BAD_REQUEST` (400) - Missing required resource identifier

These are automatically handled by tRPC and sent to the client.
