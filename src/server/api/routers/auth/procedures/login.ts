/**
 * Login procedure
 *
 * Authenticates a user with email and password.
 * - Validates credentials
 * - Verifies password with Argon2
 * - Returns user object (password excluded)
 *
 * Note: NextAuth handles session creation via its own middleware.
 * This procedure only validates credentials and returns user data.
 */

import { TRPCError } from '@trpc/server';

import type { PrismaClient } from '@prisma/client';

import { verifyPassword } from '@/server/auth/argon2';

import type { LoginInput } from '../schemas';
import type { UserWithoutPassword } from './register';

/**
 * Login user
 *
 * @param input - Login credentials (email, password)
 * @param db - Prisma client instance
 * @returns User object without password
 * @throws TRPCError with UNAUTHORIZED if credentials are invalid
 */
export async function loginUser(input: LoginInput, db: PrismaClient): Promise<UserWithoutPassword> {
  const { email, password } = input;

  // Find user by email
  const user = await db.user.findUnique({
    where: { email },
  });

  // User not found
  if (!user) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Correo electrónico o contraseña inválidos',
    });
  }

  // No password set (OAuth user)
  if (!user.password) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Correo electrónico o contraseña inválidos',
    });
  }

  // Verify password
  const isPasswordValid = await verifyPassword(user.password, password);

  if (!isPasswordValid) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Correo electrónico o contraseña inválidos',
    });
  }

  // Exclude password from return
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
