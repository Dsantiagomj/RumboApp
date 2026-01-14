/**
 * Middleware Test Suite
 *
 * Comprehensive tests for tRPC middleware:
 * - Role-Based Access Control (RBAC)
 * - Row-Level Security (RLS)
 *
 * Target: 100% test coverage
 */

import { describe, it, expect, vi } from 'vitest';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import type { Session } from 'next-auth';

import type { Context } from '../trpc';
import { createTRPCRouter, publicProcedure } from '../trpc';
import {
  adminProcedure,
  enforceResourceOwnership,
  enforceUserIdMatch,
  enforceOwnershipViaDb,
} from './index';

// Mock NextAuth
vi.mock('@/server/auth', () => ({
  auth: vi.fn(),
}));

// Mock Prisma
vi.mock('@/server/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    transaction: {
      findUnique: vi.fn(),
    },
  },
}));

/**
 * Helper to create mock context
 */
function createMockContext(session: Session | null): Context {
  return {
    session,
    db: {} as never,
    headers: new Headers(),
  };
}

/**
 * Helper to create mock admin session
 */
function createAdminSession(): Session {
  return {
    user: {
      id: 'admin-123',
      email: 'admin@example.com',
      role: 'ADMIN',
    },
    expires: new Date(Date.now() + 86400000).toISOString(),
  };
}

/**
 * Helper to create mock user session
 */
function createUserSession(id = 'user-123'): Session {
  return {
    user: {
      id,
      email: 'user@example.com',
      role: 'USER',
    },
    expires: new Date(Date.now() + 86400000).toISOString(),
  };
}

describe('Role-Based Access Control (RBAC) Middleware', () => {
  describe('adminProcedure', () => {
    const testRouter = createTRPCRouter({
      adminOnly: adminProcedure.query(() => {
        return { message: 'Admin access granted' };
      }),
    });

    it('should allow admin users', async () => {
      const mockContext = createMockContext(createAdminSession());
      const caller = testRouter.createCaller(mockContext);

      const result = await caller.adminOnly();
      expect(result).toEqual({ message: 'Admin access granted' });
    });

    it('should deny regular users with FORBIDDEN', async () => {
      const mockContext = createMockContext(createUserSession());
      const caller = testRouter.createCaller(mockContext);

      await expect(caller.adminOnly()).rejects.toThrow(TRPCError);
      await expect(caller.adminOnly()).rejects.toThrow('Admin access required');
    });

    it('should deny unauthenticated users with UNAUTHORIZED', async () => {
      const mockContext = createMockContext(null);
      const caller = testRouter.createCaller(mockContext);

      await expect(caller.adminOnly()).rejects.toThrow(TRPCError);
      await expect(caller.adminOnly()).rejects.toThrow('Authentication required');
    });

    it('should deny users without session.user with UNAUTHORIZED', async () => {
      const mockContext = createMockContext({ expires: new Date().toISOString() } as Session);
      const caller = testRouter.createCaller(mockContext);

      await expect(caller.adminOnly()).rejects.toThrow('Authentication required');
    });
  });
});

describe('Row-Level Security (RLS) Middleware', () => {
  describe('enforceResourceOwnership', () => {
    const testRouter = createTRPCRouter({
      getResource: publicProcedure
        .use(enforceResourceOwnership<{ userId: string }>((input) => input.userId))
        .input(z.object({ userId: z.string() }))
        .query(({ input }) => {
          return { message: 'Resource accessed', userId: input.userId };
        }),
    });

    it('should allow access when userId matches session user', async () => {
      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      const result = await caller.getResource({ userId: 'user-123' });
      expect(result).toEqual({ message: 'Resource accessed', userId: 'user-123' });
    });

    it('should deny access when userId does not match with FORBIDDEN', async () => {
      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      await expect(caller.getResource({ userId: 'other-user-456' })).rejects.toThrow(TRPCError);
      await expect(caller.getResource({ userId: 'other-user-456' })).rejects.toThrow(
        'Access denied'
      );
    });

    it('should deny unauthenticated users with UNAUTHORIZED', async () => {
      const mockContext = createMockContext(null);
      const caller = testRouter.createCaller(mockContext);

      await expect(caller.getResource({ userId: 'user-123' })).rejects.toThrow(
        'Authentication required'
      );
    });
  });

  describe('enforceUserIdMatch', () => {
    const testRouter = createTRPCRouter({
      createResource: publicProcedure
        .use(enforceUserIdMatch)
        .input(z.object({ userId: z.string(), name: z.string() }))
        .mutation(({ input }) => {
          return { id: 'new-resource', ...input };
        }),
    });

    it('should allow creation when userId matches session user', async () => {
      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      const result = await caller.createResource({ userId: 'user-123', name: 'Test Resource' });
      expect(result).toEqual({ id: 'new-resource', userId: 'user-123', name: 'Test Resource' });
    });

    it('should deny creation when userId does not match', async () => {
      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      await expect(
        caller.createResource({ userId: 'other-user-456', name: 'Test Resource' })
      ).rejects.toThrow('Access denied');
    });

    it('should deny unauthenticated users', async () => {
      const mockContext = createMockContext(null);
      const caller = testRouter.createCaller(mockContext);

      await expect(
        caller.createResource({ userId: 'user-123', name: 'Test Resource' })
      ).rejects.toThrow('Authentication required');
    });
  });

  describe('enforceOwnershipViaDb', () => {
    it('should allow access when database userId matches session user', async () => {
      const fetchUserId = vi.fn().mockResolvedValue('user-123');

      const testRouter = createTRPCRouter({
        updateResource: publicProcedure
          .use(enforceOwnershipViaDb(fetchUserId))
          .input(z.object({ id: z.string(), name: z.string() }))
          .mutation(({ input }) => {
            return { ...input, updated: true };
          }),
      });

      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      const result = await caller.updateResource({ id: 'resource-1', name: 'Updated Resource' });
      expect(result).toEqual({ id: 'resource-1', name: 'Updated Resource', updated: true });
      expect(fetchUserId).toHaveBeenCalledWith(mockContext, {
        id: 'resource-1',
        name: 'Updated Resource',
      });
    });

    it('should deny access when database userId does not match', async () => {
      const fetchUserId = vi.fn().mockResolvedValue('other-user-456');

      const testRouter = createTRPCRouter({
        updateResource: publicProcedure
          .use(enforceOwnershipViaDb(fetchUserId))
          .input(z.object({ id: z.string(), name: z.string() }))
          .mutation(({ input }) => {
            return { ...input, updated: true };
          }),
      });

      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      await expect(
        caller.updateResource({ id: 'resource-1', name: 'Updated Resource' })
      ).rejects.toThrow('Access denied');
    });

    it('should deny access when resource is not found', async () => {
      const fetchUserId = vi.fn().mockResolvedValue(null);

      const testRouter = createTRPCRouter({
        updateResource: publicProcedure
          .use(enforceOwnershipViaDb(fetchUserId))
          .input(z.object({ id: z.string(), name: z.string() }))
          .mutation(({ input }) => {
            return { ...input, updated: true };
          }),
      });

      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      await expect(
        caller.updateResource({ id: 'non-existent', name: 'Updated Resource' })
      ).rejects.toThrow('Access denied');
    });

    it('should deny access when userId is undefined', async () => {
      const fetchUserId = vi.fn().mockResolvedValue(undefined);

      const testRouter = createTRPCRouter({
        updateResource: publicProcedure
          .use(enforceOwnershipViaDb(fetchUserId))
          .input(z.object({ id: z.string(), name: z.string() }))
          .mutation(({ input }) => {
            return { ...input, updated: true };
          }),
      });

      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      await expect(
        caller.updateResource({ id: 'resource-1', name: 'Updated Resource' })
      ).rejects.toThrow('Access denied');
    });

    it('should deny unauthenticated users', async () => {
      const fetchUserId = vi.fn();

      const testRouter = createTRPCRouter({
        updateResource: publicProcedure
          .use(enforceOwnershipViaDb(fetchUserId))
          .input(z.object({ id: z.string(), name: z.string() }))
          .mutation(({ input }) => {
            return { ...input, updated: true };
          }),
      });

      const mockContext = createMockContext(null);
      const caller = testRouter.createCaller(mockContext);

      await expect(
        caller.updateResource({ id: 'resource-1', name: 'Updated Resource' })
      ).rejects.toThrow('Authentication required');

      // fetchUserId should not be called when user is not authenticated
      expect(fetchUserId).not.toHaveBeenCalled();
    });
  });
});

describe('Security Tests', () => {
  describe('Error Message Consistency', () => {
    it('should return consistent UNAUTHORIZED error messages', async () => {
      const testRouter = createTRPCRouter({
        adminOnly: adminProcedure.query(() => ({ message: 'ok' })),
      });

      const mockContext = createMockContext(null);
      const caller = testRouter.createCaller(mockContext);

      try {
        await caller.adminOnly();
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe('UNAUTHORIZED');
        expect((error as TRPCError).message).toBe('Authentication required');
      }
    });

    it('should return consistent FORBIDDEN error messages for non-admin users', async () => {
      const testRouter = createTRPCRouter({
        adminOnly: adminProcedure.query(() => ({ message: 'ok' })),
      });

      const mockContext = createMockContext(createUserSession());
      const caller = testRouter.createCaller(mockContext);

      try {
        await caller.adminOnly();
        expect.fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        expect((error as TRPCError).code).toBe('FORBIDDEN');
        expect((error as TRPCError).message).toBe('Admin access required');
      }
    });

    it('should not leak information about resource existence', async () => {
      // Test with non-existent resource
      const fetchUserId1 = vi.fn().mockResolvedValue(null);
      const testRouter1 = createTRPCRouter({
        update: publicProcedure
          .use(enforceOwnershipViaDb(fetchUserId1))
          .input(z.object({ id: z.string() }))
          .mutation(() => ({ ok: true })),
      });

      // Test with resource owned by different user
      const fetchUserId2 = vi.fn().mockResolvedValue('other-user-456');
      const testRouter2 = createTRPCRouter({
        update: publicProcedure
          .use(enforceOwnershipViaDb(fetchUserId2))
          .input(z.object({ id: z.string() }))
          .mutation(() => ({ ok: true })),
      });

      const mockContext = createMockContext(createUserSession('user-123'));
      const caller1 = testRouter1.createCaller(mockContext);
      const caller2 = testRouter2.createCaller(mockContext);

      let error1: TRPCError | null = null;
      let error2: TRPCError | null = null;

      try {
        await caller1.update({ id: 'non-existent' });
      } catch (err) {
        error1 = err as TRPCError;
      }

      try {
        await caller2.update({ id: 'other-user-resource' });
      } catch (err) {
        error2 = err as TRPCError;
      }

      // Both should return the same error message
      expect(error1?.message).toBe('Access denied');
      expect(error2?.message).toBe('Access denied');
      expect(error1?.code).toBe(error2?.code);
      expect(error1?.code).toBe('FORBIDDEN');
    });
  });

  describe('TRPCError Codes', () => {
    it('should throw UNAUTHORIZED for missing session', async () => {
      const testRouter = createTRPCRouter({
        test: adminProcedure.query(() => ({ ok: true })),
      });

      const mockContext = createMockContext(null);
      const caller = testRouter.createCaller(mockContext);

      try {
        await caller.test();
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as TRPCError).code).toBe('UNAUTHORIZED');
      }
    });

    it('should throw FORBIDDEN for non-admin users', async () => {
      const testRouter = createTRPCRouter({
        test: adminProcedure.query(() => ({ ok: true })),
      });

      const mockContext = createMockContext(createUserSession());
      const caller = testRouter.createCaller(mockContext);

      try {
        await caller.test();
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as TRPCError).code).toBe('FORBIDDEN');
      }
    });

    it('should throw FORBIDDEN for ownership violation', async () => {
      const testRouter = createTRPCRouter({
        test: publicProcedure
          .use(enforceUserIdMatch)
          .input(z.object({ userId: z.string() }))
          .query(() => ({ ok: true })),
      });

      const mockContext = createMockContext(createUserSession('user-123'));
      const caller = testRouter.createCaller(mockContext);

      try {
        await caller.test({ userId: 'other-user-456' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as TRPCError).code).toBe('FORBIDDEN');
      }
    });

    it('should throw BAD_REQUEST for missing resource identifier', async () => {
      const testRouter = createTRPCRouter({
        test: publicProcedure
          .use(enforceResourceOwnership<{ userId?: string }>((input) => input.userId))
          .input(z.object({ userId: z.string().optional() }))
          .query(() => ({ ok: true })),
      });

      const mockContext = createMockContext(createUserSession());
      const caller = testRouter.createCaller(mockContext);

      try {
        await caller.test({});
        expect.fail('Should have thrown');
      } catch (error) {
        expect((error as TRPCError).code).toBe('BAD_REQUEST');
        expect((error as TRPCError).message).toBe('Resource identifier required');
      }
    });
  });
});

describe('Integration Tests', () => {
  it('should properly chain multiple middleware', async () => {
    const testRouter = createTRPCRouter({
      // Admin procedure already chains auth + admin middleware
      adminAction: adminProcedure.query(() => ({ message: 'Admin action performed' })),
    });

    // Test with admin
    const adminContext = createMockContext(createAdminSession());
    const adminCaller = testRouter.createCaller(adminContext);
    const result = await adminCaller.adminAction();
    expect(result).toEqual({ message: 'Admin action performed' });

    // Test with regular user
    const userContext = createMockContext(createUserSession());
    const userCaller = testRouter.createCaller(userContext);
    await expect(userCaller.adminAction()).rejects.toThrow('Admin access required');

    // Test with no auth
    const noAuthContext = createMockContext(null);
    const noAuthCaller = testRouter.createCaller(noAuthContext);
    await expect(noAuthCaller.adminAction()).rejects.toThrow('Authentication required');
  });

  it('should work with complex ownership checks', async () => {
    const fetchUserId = vi
      .fn()
      .mockImplementation((ctx: Context, input: { transactionId: string }) => {
        // Simulate database lookup
        if (input.transactionId === 'txn-user-123') {
          return Promise.resolve('user-123');
        }
        if (input.transactionId === 'txn-user-456') {
          return Promise.resolve('user-456');
        }
        return Promise.resolve(null);
      });

    const testRouter = createTRPCRouter({
      deleteTransaction: publicProcedure
        .use(enforceOwnershipViaDb(fetchUserId))
        .input(z.object({ transactionId: z.string() }))
        .mutation(({ input }) => ({ deleted: input.transactionId })),
    });

    const mockContext = createMockContext(createUserSession('user-123'));
    const caller = testRouter.createCaller(mockContext);

    // Should succeed for owned transaction
    const result = await caller.deleteTransaction({ transactionId: 'txn-user-123' });
    expect(result).toEqual({ deleted: 'txn-user-123' });

    // Should fail for other user's transaction
    await expect(caller.deleteTransaction({ transactionId: 'txn-user-456' })).rejects.toThrow(
      'Access denied'
    );

    // Should fail for non-existent transaction
    await expect(caller.deleteTransaction({ transactionId: 'txn-non-existent' })).rejects.toThrow(
      'Access denied'
    );
  });
});
