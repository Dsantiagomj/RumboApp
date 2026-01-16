/**
 * User Router Tests
 *
 * Comprehensive test suite for user profile operations.
 * Target: 100% test coverage
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TRPCError } from '@trpc/server';

import type { Context } from '@/server/api/trpc';
import type { User, ColombianIdType, UserRole } from '@prisma/client';

import { getProfile } from './procedures/get-profile';
import { updateProfile } from './procedures/update-profile';
import { updateProfileSchema } from './schemas';

// ============================================================================
// Test Helpers
// ============================================================================

/**
 * Create mock context for testing
 */
function createMockContext(): Context {
  return {
    session: {
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
      },
      expires: new Date(Date.now() + 86400000).toISOString(),
    },
    db: {
      user: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
        delete: vi.fn(),
      },
    } as never,
    headers: new Headers(),
  };
}

/**
 * Create mock user data
 */
function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 'test-user-id',
    email: 'test@example.com',
    emailVerified: new Date(),
    password: 'hashed-password', // Should be excluded from responses
    name: 'Test User',
    image: 'https://example.com/avatar.jpg',
    nickname: 'Tester',
    colombianId: '1234567890',
    colombianIdType: 'CC' as ColombianIdType,
    role: 'USER' as UserRole,
    currency: 'COP',
    locale: 'es-CO',
    timezone: 'America/Bogota',
    theme: 'light',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    ...overrides,
  };
}

// ============================================================================
// getProfile Tests
// ============================================================================

describe('User Router - getProfile', () => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createMockContext();
    vi.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should return current user profile', async () => {
      // Mock the response without password and _deletedAt (as Prisma select would do)
      const mockUser = createMockUser();
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = mockUser;

      vi.mocked(ctx.db.user.findUnique).mockResolvedValue(userWithoutSensitiveFields);

      const result = await getProfile(ctx);

      expect(result).toBeDefined();
      expect(result.id).toBe('test-user-id');
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
      expect(result.currency).toBe('COP');
      expect(result.locale).toBe('es-CO');
      expect(result.timezone).toBe('America/Bogota');

      // Verify findUnique was called with correct parameters
      expect(ctx.db.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 'test-user-id',
          deletedAt: null,
        },
        select: expect.objectContaining({
          id: true,
          email: true,
          name: true,
          password: false,
          deletedAt: false,
        }),
      });
    });

    it('should exclude password field from response', async () => {
      const mockUser = createMockUser();
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = mockUser;

      vi.mocked(ctx.db.user.findUnique).mockResolvedValue(userWithoutSensitiveFields);

      const result = await getProfile(ctx);

      expect(result).not.toHaveProperty('password');
    });

    it('should exclude _deletedAt field from response', async () => {
      const mockUser = createMockUser();
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = mockUser;

      vi.mocked(ctx.db.user.findUnique).mockResolvedValue(userWithoutSensitiveFields);

      const result = await getProfile(ctx);

      expect(result).not.toHaveProperty('deletedAt');
    });

    it('should return all profile fields correctly', async () => {
      const mockUser = createMockUser({
        nickname: 'Juanito',
        colombianId: '9876543210',
        colombianIdType: 'CE',
        currency: 'USD',
        locale: 'en-US',
        timezone: 'America/New_York',
        theme: 'dark',
      });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = mockUser;

      vi.mocked(ctx.db.user.findUnique).mockResolvedValue(userWithoutSensitiveFields);

      const result = await getProfile(ctx);

      expect(result.nickname).toBe('Juanito');
      expect(result.colombianId).toBe('9876543210');
      expect(result.colombianIdType).toBe('CE');
      expect(result.currency).toBe('USD');
      expect(result.locale).toBe('en-US');
      expect(result.timezone).toBe('America/New_York');
      expect(result.theme).toBe('dark');
    });
  });

  describe('Error Cases', () => {
    it('should throw NOT_FOUND if user does not exist', async () => {
      vi.mocked(ctx.db.user.findUnique).mockResolvedValue(null);

      await expect(getProfile(ctx)).rejects.toThrow(TRPCError);
      await expect(getProfile(ctx)).rejects.toMatchObject({
        code: 'NOT_FOUND',
        message: 'User not found. Your session may be invalid.',
      });
    });

    it('should exclude soft-deleted users', async () => {
      vi.mocked(ctx.db.user.findUnique).mockResolvedValue(null);

      await expect(getProfile(ctx)).rejects.toThrow(TRPCError);

      // Verify deletedAt: null filter was applied
      expect(ctx.db.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            deletedAt: null,
          }),
        })
      );
    });
  });
});

// ============================================================================
// updateProfile Tests
// ============================================================================

describe('User Router - updateProfile', () => {
  let ctx: Context;

  beforeEach(() => {
    ctx = createMockContext();
    vi.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should update user profile with valid data', async () => {
      const updatedUser = createMockUser({ name: 'Updated Name' });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.findFirst).mockResolvedValue(null); // No email conflict
      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { name: 'Updated Name' });

      expect(result.name).toBe('Updated Name');
      expect(ctx.db.user.update).toHaveBeenCalledWith({
        where: {
          id: 'test-user-id',
          deletedAt: null,
        },
        data: { name: 'Updated Name' },
        select: expect.objectContaining({
          id: true,
          email: true,
          password: false,
          deletedAt: false,
        }),
      });
    });

    it('should update currency', async () => {
      const updatedUser = createMockUser({ currency: 'USD' });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { currency: 'USD' });

      expect(result.currency).toBe('USD');
    });

    it('should update locale', async () => {
      const updatedUser = createMockUser({ locale: 'en-US' });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { locale: 'en-US' });

      expect(result.locale).toBe('en-US');
    });

    it('should update timezone', async () => {
      const updatedUser = createMockUser({ timezone: 'America/New_York' });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { timezone: 'America/New_York' });

      expect(result.timezone).toBe('America/New_York');
    });

    it('should update theme', async () => {
      const updatedUser = createMockUser({ theme: 'dark' });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { theme: 'dark' });

      expect(result.theme).toBe('dark');
    });

    it('should update multiple fields at once', async () => {
      const updatedUser = createMockUser({
        name: 'Juan Pérez',
        nickname: 'Juanito',
        currency: 'USD',
        locale: 'en-US',
        timezone: 'America/New_York',
        theme: 'dark',
      });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.findFirst).mockResolvedValue(null);
      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, {
        name: 'Juan Pérez',
        nickname: 'Juanito',
        currency: 'USD',
        locale: 'en-US',
        timezone: 'America/New_York',
        theme: 'dark',
      });

      expect(result.name).toBe('Juan Pérez');
      expect(result.nickname).toBe('Juanito');
      expect(result.currency).toBe('USD');
      expect(result.locale).toBe('en-US');
      expect(result.timezone).toBe('America/New_York');
      expect(result.theme).toBe('dark');
    });

    it('should update Colombian ID and type', async () => {
      const updatedUser = createMockUser({
        colombianId: '9876543210',
        colombianIdType: 'PASAPORTE',
      });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, {
        colombianId: '9876543210',
        colombianIdType: 'PASAPORTE',
      });

      expect(result.colombianId).toBe('9876543210');
      expect(result.colombianIdType).toBe('PASAPORTE');
    });

    it('should allow updating email to a unique value', async () => {
      const updatedUser = createMockUser({ email: 'newemail@example.com' });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.findFirst).mockResolvedValue(null); // Email not taken
      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { email: 'newemail@example.com' });

      expect(result.email).toBe('newemail@example.com');

      // Verify email uniqueness check
      expect(ctx.db.user.findFirst).toHaveBeenCalledWith({
        where: {
          email: 'newemail@example.com',
          id: { not: 'test-user-id' },
          deletedAt: null,
        },
      });
    });
  });

  describe('Validation - Email Conflict', () => {
    it('should throw CONFLICT if email is taken by another user', async () => {
      const existingUser = createMockUser({
        id: 'another-user-id',
        email: 'taken@example.com',
      });

      vi.mocked(ctx.db.user.findFirst).mockResolvedValue(existingUser);

      await expect(updateProfile(ctx, { email: 'taken@example.com' })).rejects.toThrow(TRPCError);
      await expect(updateProfile(ctx, { email: 'taken@example.com' })).rejects.toMatchObject({
        code: 'CONFLICT',
        message: 'Email is already taken by another user',
      });

      // Should not call update if email is taken
      expect(ctx.db.user.update).not.toHaveBeenCalled();
    });

    it('should allow same email (no change)', async () => {
      const updatedUser = createMockUser({ name: 'Same Email' });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.findFirst).mockResolvedValue(null);
      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      // Updating with same email should work
      const result = await updateProfile(ctx, {
        email: 'test@example.com',
        name: 'Same Email',
      });

      expect(result.email).toBe('test@example.com');
    });
  });

  describe('Validation - Field Constraints', () => {
    it('should validate currency enum', () => {
      const result = updateProfileSchema.safeParse({ currency: 'INVALID' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Currency must be COP, USD, or EUR');
      }
    });

    it('should validate locale enum', () => {
      const result = updateProfileSchema.safeParse({ locale: 'fr-FR' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Locale must be es-CO or en-US');
      }
    });

    it('should validate theme enum', () => {
      const result = updateProfileSchema.safeParse({ theme: 'auto' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Theme must be light, dark, or system');
      }
    });

    it('should validate timezone format', () => {
      const result = updateProfileSchema.safeParse({ timezone: 'InvalidTimezone' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Invalid timezone');
      }
    });

    it('should accept valid timezone', () => {
      const result = updateProfileSchema.safeParse({ timezone: 'America/Bogota' });
      expect(result.success).toBe(true);
    });

    it('should validate name length (min)', () => {
      const result = updateProfileSchema.safeParse({ name: '' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('at least 1 character');
      }
    });

    it('should validate name length (max)', () => {
      const longName = 'a'.repeat(101);
      const result = updateProfileSchema.safeParse({ name: longName });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('at most 100 characters');
      }
    });

    it('should validate email format', () => {
      const result = updateProfileSchema.safeParse({ email: 'invalid-email' });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.message).toContain('Invalid email');
      }
    });
  });

  describe('Security - Role Changes', () => {
    it('should not allow role updates through schema', () => {
      // The schema doesn't include 'role', so this should fail TypeScript validation
      const result = updateProfileSchema.safeParse({ role: 'ADMIN' });

      // Role is not in the schema, so it should be ignored
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty('role');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty update (no fields)', async () => {
      const updatedUser = createMockUser();
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, {});

      expect(result).toBeDefined();
      expect(ctx.db.user.update).toHaveBeenCalledWith({
        where: {
          id: 'test-user-id',
          deletedAt: null,
        },
        data: {},
        select: expect.any(Object),
      });
    });

    it('should handle nullable fields (image)', async () => {
      const updatedUser = createMockUser({ image: null });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { image: null });

      expect(result.image).toBeNull();
    });

    it('should handle nullable fields (nickname)', async () => {
      const updatedUser = createMockUser({ nickname: null });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { nickname: null });

      expect(result.nickname).toBeNull();
    });

    it('should handle nullable fields (colombianId)', async () => {
      const updatedUser = createMockUser({ colombianId: null, colombianIdType: null });
      const {
        password: _password,
        deletedAt: _deletedAt,
        ...userWithoutSensitiveFields
      } = updatedUser;

      vi.mocked(ctx.db.user.update).mockResolvedValue(userWithoutSensitiveFields);

      const result = await updateProfile(ctx, { colombianId: null, colombianIdType: null });

      expect(result.colombianId).toBeNull();
      expect(result.colombianIdType).toBeNull();
    });
  });
});

// ============================================================================
// Schema Validation Tests
// ============================================================================

describe('User Router - Schema Validation', () => {
  describe('updateProfileSchema', () => {
    it('should accept valid update data', () => {
      const validData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        currency: 'COP' as const,
        locale: 'es-CO' as const,
        timezone: 'America/Bogota',
        theme: 'dark' as const,
      };

      const result = updateProfileSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should accept partial data', () => {
      const partialData = { name: 'Juan' };
      const result = updateProfileSchema.safeParse(partialData);
      expect(result.success).toBe(true);
    });

    it('should accept Colombian ID types', () => {
      const ccResult = updateProfileSchema.safeParse({ colombianIdType: 'CC' });
      expect(ccResult.success).toBe(true);

      const ceResult = updateProfileSchema.safeParse({ colombianIdType: 'CE' });
      expect(ceResult.success).toBe(true);

      const passportResult = updateProfileSchema.safeParse({ colombianIdType: 'PASAPORTE' });
      expect(passportResult.success).toBe(true);
    });

    it('should reject invalid Colombian ID type', () => {
      const result = updateProfileSchema.safeParse({ colombianIdType: 'INVALID' });
      expect(result.success).toBe(false);
    });

    it('should accept all valid currencies', () => {
      const currencies = ['COP', 'USD', 'EUR'];

      currencies.forEach((currency) => {
        const result = updateProfileSchema.safeParse({ currency });
        expect(result.success).toBe(true);
      });
    });

    it('should accept all valid locales', () => {
      const locales = ['es-CO', 'en-US'];

      locales.forEach((locale) => {
        const result = updateProfileSchema.safeParse({ locale });
        expect(result.success).toBe(true);
      });
    });

    it('should accept all valid themes', () => {
      const themes = ['light', 'dark', 'system'];

      themes.forEach((theme) => {
        const result = updateProfileSchema.safeParse({ theme });
        expect(result.success).toBe(true);
      });
    });

    it('should accept valid timezones', () => {
      const timezones = [
        'America/Bogota',
        'America/New_York',
        'Europe/London',
        'Asia/Tokyo',
        'UTC',
      ];

      timezones.forEach((timezone) => {
        const result = updateProfileSchema.safeParse({ timezone });
        expect(result.success).toBe(true);
      });
    });
  });
});
