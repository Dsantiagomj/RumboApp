import { hash, verify } from '@node-rs/argon2';

/**
 * Hash a password using Argon2id with OWASP 2024 compliant parameters
 *
 * @param password - Plain text password to hash
 * @returns Hashed password string
 *
 * OWASP 2024 Parameters:
 * - memoryCost: 65536 (64 MiB) - Minimum recommended memory
 * - timeCost: 3 iterations - Minimum recommended iterations
 * - parallelism: 4 threads - For production servers
 * - outputLen: 32 bytes - Secure hash length
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, {
    memoryCost: 65536, // 64 MiB (OWASP 2024 minimum)
    timeCost: 3, // 3 iterations (OWASP 2024 minimum)
    outputLen: 32, // 32 bytes
    parallelism: 4, // 4 threads (production servers)
  });
}

/**
 * Verify a password against an Argon2 hash
 *
 * @param hash - The stored Argon2 hash
 * @param password - The plain text password to verify
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    return await verify(hash, password);
  } catch (error) {
    // If verification fails due to invalid hash format, return false
    console.error('Password verification error:', error);
    return false;
  }
}
