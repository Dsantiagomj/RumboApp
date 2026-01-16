/**
 * Reset Password Tests
 *
 * Tests for resetPassword function logic.
 * Coverage target: 100%
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PrismaClient, User } from '@prisma/client';

// Mock dependencies before imports
vi.mock('@/server/lib/email', () => ({
  sendPasswordChangedEmail: vi.fn(),
}));

vi.mock('@/server/lib/tokens', () => ({
  verifyResetToken: vi.fn(),
  invalidateUserTokens: vi.fn(),
}));

vi.mock('@/server/auth/argon2', () => ({
  hashPassword: vi.fn(),
}));

const { sendPasswordChangedEmail } = await import('@/server/lib/email');
const { verifyResetToken, invalidateUserTokens } = await import('@/server/lib/tokens');
const { hashPassword } = await import('@/server/auth/argon2');
const { resetPassword } = await import('./reset-password-logic');

// Mock Prisma client
const createMockPrismaClient = () => {
  return {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    passwordResetToken: {
      delete: vi.fn(),
    },
  } as unknown as PrismaClient;
};

describe('resetPassword', () => {
  let mockDb: PrismaClient;

  const mockUser: User = {
    id: 'user-456',
    email: 'reset@example.com',
    name: 'Test User',
    password: 'old-password',
    emailVerified: null,
    image: null,
    nickname: null,
    colombianId: null,
    colombianIdType: null,
    role: 'USER',
    currency: 'COP',
    locale: 'es-CO',
    timezone: 'America/Bogota',
    theme: 'system',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    mockDb = createMockPrismaClient();
    vi.clearAllMocks();
  });

  it('should reset password with valid token', async () => {
    vi.mocked(verifyResetToken).mockResolvedValue({
      userId: mockUser.id,
      isExpired: false,
    });
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(hashPassword).mockResolvedValue('new-hashed-password');
    vi.mocked(mockDb.user.update).mockResolvedValue({
      ...mockUser,
      password: 'new-hashed-password',
    });
    vi.mocked(invalidateUserTokens).mockResolvedValue(1);
    vi.mocked(sendPasswordChangedEmail).mockResolvedValue();

    const result = await resetPassword('valid-token', 'NewPass123', mockDb);

    expect(verifyResetToken).toHaveBeenCalledWith('valid-token');
    expect(hashPassword).toHaveBeenCalledWith('NewPass123');
    expect(mockDb.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: expect.objectContaining({
        password: 'new-hashed-password',
        updatedAt: expect.any(Date),
      }),
    });
    expect(invalidateUserTokens).toHaveBeenCalledWith(mockUser.id);
    expect(sendPasswordChangedEmail).toHaveBeenCalledWith(mockUser.email, mockUser.name);
    expect(result).toEqual({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.',
    });
  });

  it('should throw BAD_REQUEST for invalid token', async () => {
    vi.mocked(verifyResetToken).mockResolvedValue(null);

    await expect(resetPassword('invalid-token', 'NewPass123', mockDb)).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: 'Invalid or expired reset token. Please request a new password reset.',
    });
  });

  it('should throw BAD_REQUEST for expired token', async () => {
    vi.mocked(verifyResetToken).mockResolvedValue({
      userId: mockUser.id,
      isExpired: true,
    });
    vi.mocked(mockDb.passwordResetToken.delete).mockResolvedValue({
      id: 'token-id',
      userId: mockUser.id,
      token: 'expired-token',
      expires: new Date(),
      createdAt: new Date(),
    });

    await expect(resetPassword('expired-token', 'NewPass123', mockDb)).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: 'Reset link has expired. Please request a new password reset.',
    });

    expect(mockDb.passwordResetToken.delete).toHaveBeenCalledWith({
      where: { token: 'expired-token' },
    });
  });

  it('should throw BAD_REQUEST if user not found', async () => {
    vi.mocked(verifyResetToken).mockResolvedValue({
      userId: 'non-existent',
      isExpired: false,
    });
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(null);

    await expect(resetPassword('valid-token', 'NewPass123', mockDb)).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: 'User account not found or has been deleted.',
    });
  });

  it('should throw BAD_REQUEST for deleted user', async () => {
    const deletedUser = { ...mockUser, deletedAt: new Date() };
    vi.mocked(verifyResetToken).mockResolvedValue({
      userId: mockUser.id,
      isExpired: false,
    });
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(deletedUser);

    await expect(resetPassword('valid-token', 'NewPass123', mockDb)).rejects.toMatchObject({
      code: 'BAD_REQUEST',
      message: 'User account not found or has been deleted.',
    });
  });

  it('should succeed even if confirmation email fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(verifyResetToken).mockResolvedValue({
      userId: mockUser.id,
      isExpired: false,
    });
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(hashPassword).mockResolvedValue('new-hashed-password');
    vi.mocked(mockDb.user.update).mockResolvedValue({
      ...mockUser,
      password: 'new-hashed-password',
    });
    vi.mocked(invalidateUserTokens).mockResolvedValue(1);
    vi.mocked(sendPasswordChangedEmail).mockRejectedValue(new Error('Email service down'));

    const result = await resetPassword('valid-token', 'NewPass123', mockDb);

    expect(result.success).toBe(true);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to send password changed email:',
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  it('should throw INTERNAL_SERVER_ERROR on unexpected database errors', async () => {
    vi.mocked(verifyResetToken).mockResolvedValue({
      userId: mockUser.id,
      isExpired: false,
    });
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(hashPassword).mockResolvedValue('new-hashed-password');
    vi.mocked(mockDb.user.update).mockRejectedValue(new Error('Database connection lost'));

    await expect(resetPassword('valid-token', 'NewPass123', mockDb)).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while resetting your password. Please try again later.',
    });
  });
});
