/**
 * Register procedure
 *
 * Creates a new user account with email and password.
 * - Validates input (email, password strength, name)
 * - Checks for duplicate email
 * - Hashes password with Argon2
 * - Creates user in database
 * - Returns user object (password excluded)
 */

import { TRPCError } from '@trpc/server';

import type { PrismaClient, User } from '@prisma/client';

import { hashPassword } from '@/server/auth/argon2';

import type { RegisterInput } from '../schemas';

/**
 * User object without password field
 */
export type UserWithoutPassword = Omit<User, 'password'>;

/**
 * Register a new user
 *
 * @param input - Registration data (email, password, name)
 * @param db - Prisma client instance
 * @returns User object without password
 * @throws TRPCError with CONFLICT if email already exists
 * @throws TRPCError with BAD_REQUEST if validation fails (handled by Zod)
 */
export async function registerUser(
  input: RegisterInput,
  db: PrismaClient
): Promise<UserWithoutPassword> {
  const { email, password, name } = input;

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Email already registered',
    });
  }

  // Hash password with Argon2
  const hashedPassword = await hashPassword(password);

  // Create user in database
  const user = await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  // Exclude password from return
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}
