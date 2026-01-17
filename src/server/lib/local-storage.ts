/**
 * Local File Storage for Development
 *
 * Provides file storage using the local filesystem as a fallback
 * when R2 credentials are not configured (development mode)
 */

import fs from 'fs/promises';
import path from 'path';

const STORAGE_DIR = path.join(process.cwd(), '.local-storage');

/**
 * Ensures the storage directory exists
 */
async function ensureStorageDir(): Promise<void> {
  try {
    await fs.access(STORAGE_DIR);
  } catch {
    await fs.mkdir(STORAGE_DIR, { recursive: true });
  }
}

/**
 * Uploads a file to local storage
 * @param buffer - The file content as a Buffer
 * @param key - The storage key (path) where the file will be stored
 * @returns Promise resolving to the local file path
 */
export async function uploadToLocalStorage(buffer: Buffer, key: string): Promise<string> {
  await ensureStorageDir();

  const filePath = path.join(STORAGE_DIR, key);
  const fileDir = path.dirname(filePath);

  // Ensure the directory for this file exists
  await fs.mkdir(fileDir, { recursive: true });

  // Write the file
  await fs.writeFile(filePath, buffer);

  // Return a file:// URL
  return `file://${filePath}`;
}

/**
 * Reads a file from local storage
 * @param key - The storage key (path) of the file
 * @returns Promise resolving to the file buffer
 */
export async function readFromLocalStorage(key: string): Promise<Buffer> {
  const filePath = path.join(STORAGE_DIR, key);
  return fs.readFile(filePath);
}

/**
 * Deletes a file from local storage
 * @param key - The storage key (path) of the file to delete
 */
export async function deleteFromLocalStorage(key: string): Promise<void> {
  const filePath = path.join(STORAGE_DIR, key);
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Ignore errors if file doesn't exist
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Checks if R2 is configured
 */
export function isR2Configured(): boolean {
  return !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME
  );
}
