import crypto from 'crypto';

/**
 * Encrypts a password for temporary storage in the database.
 * Uses AES-256-CBC with a random IV for each encryption.
 *
 * @param password - The password to encrypt
 * @returns Encrypted string in format "iv:encryptedData"
 * @throws Error if ENCRYPTION_KEY environment variable is not set
 */
export function encryptPassword(password: string): string {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable not set');
  }

  const algorithm = 'aes-256-cbc';
  const key = crypto.scryptSync(encryptionKey, 'salt', 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(password, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Prepend IV to encrypted data (needed for decryption)
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypts a password that was encrypted with encryptPassword().
 *
 * @param encryptedPassword - The encrypted password in format "iv:encryptedData"
 * @returns The original password
 * @throws Error if ENCRYPTION_KEY is not set or decryption fails
 */
export function decryptPassword(encryptedPassword: string): string {
  const encryptionKey = process.env.ENCRYPTION_KEY;
  if (!encryptionKey) {
    throw new Error('ENCRYPTION_KEY environment variable not set');
  }

  try {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(encryptionKey, 'salt', 32);

    // Split IV and encrypted data
    const parts = encryptedPassword.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted password format');
    }

    const iv = Buffer.from(parts[0]!, 'hex');
    const encryptedText = parts[1]!;

    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to decrypt password: ${error.message}`);
    }
    throw error;
  }
}
