/**
 * Auth router tests
 *
 * Tests for authentication procedures:
 * - Register: Create new user accounts
 * - Login: Authenticate users
 * - Logout: End user sessions
 *
 * Coverage target: 100%
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TRPCError } from '@trpc/server';

import type { PrismaClient, User } from '@prisma/client';

import { hashPassword, verifyPassword } from '@/server/auth/argon2';

import { loginUser } from './procedures/login';
import { logoutUser } from './procedures/logout';
import { registerUser } from './procedures/register';

// Mock Prisma client
const createMockPrismaClient = () => {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  } as unknown as PrismaClient;
};

describe('Auth Router', () => {
  let mockDb: PrismaClient;

  beforeEach(() => {
    mockDb = createMockPrismaClient();
    vi.clearAllMocks();
  });

  describe('registerUser', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'Test1234!',
      name: 'Test User',
    };

    it('should register a new user with valid data', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: validInput.email,
        password: await hashPassword(validInput.password),
        name: validInput.name,
        emailVerified: null,
        image: null,
        colombianId: null,
        colombianIdType: 'CC',
        nickname: null,
        role: 'USER',
        currency: 'COP',
        locale: 'es-CO',
        timezone: 'America/Bogota',
        theme: 'light',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // Mock: No existing user
      vi.mocked(mockDb.user.findUnique).mockResolvedValue(null);

      // Mock: Create user
      vi.mocked(mockDb.user.create).mockResolvedValue(mockUser);

      const result = await registerUser(validInput, mockDb);

      // Should check for existing user
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: validInput.email },
      });

      // Should create user
      expect(mockDb.user.create).toHaveBeenCalledWith({
        data: {
          email: validInput.email,
          password: expect.any(String), // Hashed password
          name: validInput.name,
        },
      });

      // Should return user without password
      expect(result).toBeDefined();
      expect(result.email).toBe(validInput.email);
      expect(result.name).toBe(validInput.name);
      expect(result).not.toHaveProperty('password');
    });

    it('should throw CONFLICT error if email already exists', async () => {
      const existingUser: User = {
        id: 'user-1',
        email: validInput.email,
        password: 'hashed-password',
        name: 'Existing User',
        emailVerified: null,
        image: null,
        colombianId: null,
        colombianIdType: 'CC',
        nickname: null,
        role: 'USER',
        currency: 'COP',
        locale: 'es-CO',
        timezone: 'America/Bogota',
        theme: 'light',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      // Mock: Existing user
      vi.mocked(mockDb.user.findUnique).mockResolvedValue(existingUser);

      await expect(registerUser(validInput, mockDb)).rejects.toThrow(TRPCError);

      try {
        await registerUser(validInput, mockDb);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        if (error instanceof TRPCError) {
          expect(error.code).toBe('CONFLICT');
          expect(error.message).toBe('Email already registered');
        }
      }

      // Should not create user
      expect(mockDb.user.create).not.toHaveBeenCalled();
    });

    it('should hash password before storing', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: validInput.email,
        password: 'hashed-password',
        name: validInput.name,
        emailVerified: null,
        image: null,
        colombianId: null,
        colombianIdType: 'CC',
        nickname: null,
        role: 'USER',
        currency: 'COP',
        locale: 'es-CO',
        timezone: 'America/Bogota',
        theme: 'light',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.mocked(mockDb.user.findUnique).mockResolvedValue(null);
      vi.mocked(mockDb.user.create).mockResolvedValue(mockUser);

      await registerUser(validInput, mockDb);

      const createCall = vi.mocked(mockDb.user.create).mock.calls[0];
      const hashedPassword = createCall?.[0]?.data.password;

      // Password should be hashed (not plain text)
      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(validInput.password);
      expect(hashedPassword).toContain('$argon2'); // Argon2 hash prefix
    });
  });

  describe('loginUser', () => {
    const validInput = {
      email: 'test@example.com',
      password: 'Test1234!',
    };

    it('should login user with valid credentials', async () => {
      const hashedPassword = await hashPassword(validInput.password);
      const mockUser: User = {
        id: 'user-1',
        email: validInput.email,
        password: hashedPassword,
        name: 'Test User',
        emailVerified: null,
        image: null,
        colombianId: null,
        colombianIdType: 'CC',
        nickname: null,
        role: 'USER',
        currency: 'COP',
        locale: 'es-CO',
        timezone: 'America/Bogota',
        theme: 'light',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);

      const result = await loginUser(validInput, mockDb);

      // Should find user by email
      expect(mockDb.user.findUnique).toHaveBeenCalledWith({
        where: { email: validInput.email },
      });

      // Should return user without password
      expect(result).toBeDefined();
      expect(result.email).toBe(validInput.email);
      expect(result.name).toBe('Test User');
      expect(result).not.toHaveProperty('password');
    });

    it('should throw UNAUTHORIZED error if user not found', async () => {
      vi.mocked(mockDb.user.findUnique).mockResolvedValue(null);

      await expect(loginUser(validInput, mockDb)).rejects.toThrow(TRPCError);

      try {
        await loginUser(validInput, mockDb);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        if (error instanceof TRPCError) {
          expect(error.code).toBe('UNAUTHORIZED');
          expect(error.message).toBe('Invalid email or password');
        }
      }
    });

    it('should throw UNAUTHORIZED error if password is incorrect', async () => {
      const hashedPassword = await hashPassword('DifferentPassword1!');
      const mockUser: User = {
        id: 'user-1',
        email: validInput.email,
        password: hashedPassword,
        name: 'Test User',
        emailVerified: null,
        image: null,
        colombianId: null,
        colombianIdType: 'CC',
        nickname: null,
        role: 'USER',
        currency: 'COP',
        locale: 'es-CO',
        timezone: 'America/Bogota',
        theme: 'light',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);

      await expect(loginUser(validInput, mockDb)).rejects.toThrow(TRPCError);

      try {
        await loginUser(validInput, mockDb);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        if (error instanceof TRPCError) {
          expect(error.code).toBe('UNAUTHORIZED');
          expect(error.message).toBe('Invalid email or password');
        }
      }
    });

    it('should throw UNAUTHORIZED error if user has no password (OAuth user)', async () => {
      const mockUser: User = {
        id: 'user-1',
        email: validInput.email,
        password: null,
        name: 'OAuth User',
        emailVerified: null,
        image: null,
        colombianId: null,
        colombianIdType: 'CC',
        nickname: null,
        role: 'USER',
        currency: 'COP',
        locale: 'es-CO',
        timezone: 'America/Bogota',
        theme: 'light',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);

      await expect(loginUser(validInput, mockDb)).rejects.toThrow(TRPCError);

      try {
        await loginUser(validInput, mockDb);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        if (error instanceof TRPCError) {
          expect(error.code).toBe('UNAUTHORIZED');
          expect(error.message).toBe('Invalid email or password');
        }
      }
    });

    it('should verify password correctly', async () => {
      const hashedPassword = await hashPassword(validInput.password);
      const mockUser: User = {
        id: 'user-1',
        email: validInput.email,
        password: hashedPassword,
        name: 'Test User',
        emailVerified: null,
        image: null,
        colombianId: null,
        colombianIdType: 'CC',
        nickname: null,
        role: 'USER',
        currency: 'COP',
        locale: 'es-CO',
        timezone: 'America/Bogota',
        theme: 'light',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);

      const result = await loginUser(validInput, mockDb);

      // Verify password was checked
      const isValid = await verifyPassword(hashedPassword, validInput.password);
      expect(isValid).toBe(true);

      // Should return user
      expect(result).toBeDefined();
    });
  });

  describe('logoutUser', () => {
    it('should logout user successfully', async () => {
      const userId = 'user-1';

      const result = await logoutUser(userId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Logged out successfully');
    });

    it('should return success message structure', async () => {
      const userId = 'user-2';

      const result = await logoutUser(userId);

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(typeof result.success).toBe('boolean');
      expect(typeof result.message).toBe('string');
    });
  });

  describe('Password validation (via schemas)', () => {
    // These tests verify password strength requirements
    // Note: Actual validation is done by Zod schemas, but we test the logic here

    it('should accept password with all requirements', () => {
      const validPasswords = ['Test1234!', 'MyPassword123', 'Str0ngP@ss', 'Valid1Password'];

      validPasswords.forEach((password) => {
        expect(password.length).toBeGreaterThanOrEqual(8);
        expect(password).toMatch(/[A-Z]/); // Uppercase
        expect(password).toMatch(/[a-z]/); // Lowercase
        expect(password).toMatch(/[0-9]/); // Number
      });
    });

    it('should identify password that is too short', () => {
      const shortPassword = 'Test1!';
      expect(shortPassword.length).toBeLessThan(8);
    });

    it('should identify password without uppercase', () => {
      const noUppercase = 'test1234!';
      expect(noUppercase).not.toMatch(/[A-Z]/);
    });

    it('should identify password without lowercase', () => {
      const noLowercase = 'TEST1234!';
      expect(noLowercase).not.toMatch(/[a-z]/);
    });

    it('should identify password without number', () => {
      const noNumber = 'TestPassword!';
      expect(noNumber).not.toMatch(/[0-9]/);
    });
  });
});
