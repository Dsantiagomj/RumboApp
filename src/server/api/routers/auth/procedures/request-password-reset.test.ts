/**
 * Request Password Reset Tests
 *
 * Tests for requestPasswordReset function logic.
 * Coverage target: 100%
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { PrismaClient, User } from '@prisma/client';

// Mock dependencies before imports
vi.mock('@/server/lib/email', () => ({
  sendPasswordResetEmail: vi.fn(),
}));

vi.mock('@/server/lib/tokens', () => ({
  createResetToken: vi.fn(),
}));

const { sendPasswordResetEmail } = await import('@/server/lib/email');
const { createResetToken } = await import('@/server/lib/tokens');
const { requestPasswordReset } = await import('./request-password-reset-logic');

// Mock Prisma client
const createMockPrismaClient = () => {
  return {
    user: {
      findUnique: vi.fn(),
    },
  } as unknown as PrismaClient;
};

describe('requestPasswordReset', () => {
  let mockDb: PrismaClient;

  const mockUser: User = {
    id: 'user-reset-123',
    email: 'reset@example.com',
    name: 'Reset User',
    password: 'hashed-password',
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

  it('should send reset email for existing user', async () => {
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(createResetToken).mockResolvedValue({
      id: 'token-id',
      userId: mockUser.id,
      token: 'reset-token-abc123',
      expires: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    });
    vi.mocked(sendPasswordResetEmail).mockResolvedValue();

    const result = await requestPasswordReset('reset@example.com', mockDb);

    expect(mockDb.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'reset@example.com' },
      select: { id: true, name: true, email: true, deletedAt: true },
    });
    expect(createResetToken).toHaveBeenCalledWith(mockUser.id);
    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      mockUser.email,
      'reset-token-abc123',
      mockUser.name
    );
    expect(result).toEqual({
      success: true,
      message:
        'If an account exists with this email, you will receive a password reset link shortly.',
    });
  });

  it('should return success for non-existent user (no user enumeration)', async () => {
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(null);

    const result = await requestPasswordReset('nonexistent@example.com', mockDb);

    expect(createResetToken).not.toHaveBeenCalled();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: true,
      message:
        'If an account exists with this email, you will receive a password reset link shortly.',
    });
  });

  it('should not send email for deleted user', async () => {
    const deletedUser = { ...mockUser, deletedAt: new Date() };
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(deletedUser);

    const result = await requestPasswordReset('deleted@example.com', mockDb);

    expect(createResetToken).not.toHaveBeenCalled();
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it('should throw INTERNAL_SERVER_ERROR on unexpected errors', async () => {
    vi.mocked(mockDb.user.findUnique).mockRejectedValue(new Error('DB error'));

    await expect(requestPasswordReset('error@example.com', mockDb)).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An error occurred while processing your request. Please try again later.',
    });
  });

  it('should throw INTERNAL_SERVER_ERROR if token creation fails', async () => {
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(createResetToken).mockRejectedValue(new Error('Token creation failed'));

    await expect(requestPasswordReset('reset@example.com', mockDb)).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
    });
  });

  it('should throw INTERNAL_SERVER_ERROR if email sending fails', async () => {
    vi.mocked(mockDb.user.findUnique).mockResolvedValue(mockUser);
    vi.mocked(createResetToken).mockResolvedValue({
      id: 'token-id',
      userId: mockUser.id,
      token: 'reset-token-abc123',
      expires: new Date(Date.now() + 3600000),
      createdAt: new Date(),
    });
    vi.mocked(sendPasswordResetEmail).mockRejectedValue(new Error('Email service down'));

    await expect(requestPasswordReset('reset@example.com', mockDb)).rejects.toMatchObject({
      code: 'INTERNAL_SERVER_ERROR',
    });
  });
});
