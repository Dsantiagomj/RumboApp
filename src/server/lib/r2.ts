/**
 * Cloudflare R2 Storage Client Utility
 *
 * This module provides a type-safe interface for interacting with Cloudflare R2
 * (S3-compatible object storage) for file uploads, downloads, and management.
 *
 * Required Environment Variables:
 * - R2_ACCOUNT_ID: Your Cloudflare account ID
 * - R2_ACCESS_KEY_ID: R2 API access key ID
 * - R2_SECRET_ACCESS_KEY: R2 API secret access key
 * - R2_BUCKET_NAME: The name of your R2 bucket
 * - R2_PUBLIC_URL: The public URL for accessing files (optional for some operations)
 *
 * @example
 * ```ts
 * import { uploadToR2, generateImportKey, getSignedDownloadUrl } from '@/server/lib/r2';
 *
 * // Upload a file
 * const key = generateImportKey(userId, 'receipt.pdf');
 * const url = await uploadToR2(fileBuffer, key, 'application/pdf');
 *
 * // Generate a download URL
 * const downloadUrl = await getSignedDownloadUrl(key, 3600);
 * ```
 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Validates that all required R2 environment variables are set
 * @throws Error if any required environment variable is missing
 */
function validateR2Config(): void {
  const missing: string[] = [];

  if (!process.env.R2_ACCOUNT_ID) missing.push('R2_ACCOUNT_ID');
  if (!process.env.R2_ACCESS_KEY_ID) missing.push('R2_ACCESS_KEY_ID');
  if (!process.env.R2_SECRET_ACCESS_KEY) missing.push('R2_SECRET_ACCESS_KEY');
  if (!process.env.R2_BUCKET_NAME) missing.push('R2_BUCKET_NAME');

  if (missing.length > 0) {
    throw new Error(
      `Missing required R2 environment variables: ${missing.join(', ')}. ` +
        `Please check your .env file and ensure all R2 credentials are set.`
    );
  }
}

/**
 * Creates and configures the S3 client for Cloudflare R2
 * @returns Configured S3Client instance
 */
function createR2Client(): S3Client {
  validateR2Config();

  return new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

// Singleton instance of the R2 client
let r2Client: S3Client | null = null;

/**
 * Gets or creates the R2 client instance
 * @returns S3Client instance configured for R2
 */
function getR2Client(): S3Client {
  if (!r2Client) {
    r2Client = createR2Client();
  }
  return r2Client;
}

/**
 * Sanitizes a filename by removing special characters and replacing spaces
 * @param fileName - The original filename
 * @returns Sanitized filename safe for S3 storage
 */
function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-zA-Z0-9._-]/g, '') // Remove special characters except dots, hyphens, and underscores
    .toLowerCase();
}

/**
 * Generates a unique S3 key for import files
 * @param userId - The ID of the user uploading the file
 * @param fileName - The original filename
 * @returns S3 key in format: imports/{userId}/{timestamp}-{sanitizedFileName}
 *
 * @example
 * generateImportKey("user123", "My Receipt.pdf")
 * // Returns: "imports/user123/1705420800000-my-receipt.pdf"
 */
export function generateImportKey(userId: string, fileName: string): string {
  const sanitizedFileName = sanitizeFileName(fileName);
  const timestamp = Date.now();
  return `imports/${userId}/${timestamp}-${sanitizedFileName}`;
}

/**
 * Uploads a file buffer to Cloudflare R2
 * @param buffer - The file content as a Buffer
 * @param key - The S3 key (path) where the file will be stored
 * @param contentType - The MIME type of the file (e.g., "application/pdf", "image/jpeg")
 * @returns Promise resolving to the public URL of the uploaded file
 * @throws Error if upload fails or R2 configuration is invalid
 *
 * @example
 * const buffer = await readFile("receipt.pdf");
 * const url = await uploadToR2(buffer, "imports/user123/receipt.pdf", "application/pdf");
 * console.log("File uploaded to:", url);
 */
export async function uploadToR2(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  try {
    const client = getR2Client();

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await client.send(command);

    // Return the public URL of the uploaded file
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return publicUrl;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to upload file to R2: ${errorMessage}`);
  }
}

/**
 * Generates a presigned URL for downloading a file from R2
 * @param key - The S3 key (path) of the file
 * @param expiresIn - URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Promise resolving to a presigned download URL
 * @throws Error if URL generation fails or R2 configuration is invalid
 *
 * @example
 * const downloadUrl = await getSignedDownloadUrl("imports/user123/receipt.pdf");
 * // URL valid for 1 hour by default
 *
 * const shortLivedUrl = await getSignedDownloadUrl("imports/user123/receipt.pdf", 300);
 * // URL valid for 5 minutes
 */
export async function getSignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const client = getR2Client();

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    const signedUrl = await getSignedUrl(client, command, { expiresIn });
    return signedUrl;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to generate signed download URL for key "${key}": ${errorMessage}`);
  }
}

/**
 * Deletes a file from Cloudflare R2
 * @param key - The S3 key (path) of the file to delete
 * @returns Promise that resolves when the file is deleted
 * @throws Error if deletion fails or R2 configuration is invalid
 *
 * @example
 * await deleteFromR2("imports/user123/old-receipt.pdf");
 * console.log("File deleted successfully");
 */
export async function deleteFromR2(key: string): Promise<void> {
  try {
    const client = getR2Client();

    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    await client.send(command);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to delete file from R2 with key "${key}": ${errorMessage}`);
  }
}
