/**
 * BullMQ Job Data Types
 *
 * Type definitions for job payloads processed by BullMQ workers
 */

import type { FileType, BankFormat } from '@prisma/client';

/**
 * Import Job Data
 * Payload for CSV/PDF file import processing
 *
 * Flow:
 * 1. User uploads file -> Upload service creates ImportJob record
 * 2. Upload service adds job to importQueue with this data
 * 3. Import worker processes file, parses transactions
 * 4. Worker updates ImportJob status throughout process
 * 5. On success: adds categorization jobs for each transaction
 */
export interface ImportJobData {
  /** ImportJob ID from database */
  jobId: string;
  /** User ID who initiated the import */
  userId: string;
  /** File URL in storage (Cloudflare R2) */
  fileUrl: string;
  /** File type: CSV or PDF */
  fileType: FileType;
  /** Whether file requires password (for encrypted PDFs) */
  hasPassword?: boolean;
  /** Bank format for parsing (optional, may be detected) */
  bankFormat?: BankFormat;
}

/**
 * Categorization Job Data
 * Payload for AI-powered transaction categorization
 *
 * Flow:
 * 1. Import worker creates ImportedTransaction records
 * 2. Worker adds categorization job for each transaction
 * 3. Categorization worker uses AI to suggest category
 * 4. Worker updates ImportedTransaction with suggestions
 */
export interface CategorizationJobData {
  /** ImportedTransaction ID from database */
  transactionId: string;
  /** User ID for accessing user's custom categories */
  userId: string;
  /** Transaction description to categorize */
  description: string;
  /** Transaction amount (for context) */
  amount: number;
  /** Merchant name if available (for better categorization) */
  merchant?: string;
  /** Transaction type: INCOME or EXPENSE */
  type: 'INCOME' | 'EXPENSE';
}

/**
 * Job Result Types
 * Return types for completed jobs
 */

export interface ImportJobResult {
  success: boolean;
  accountsCreated: number;
  transactionsCreated: number;
  categorizationJobsQueued: number;
  error?: string;
}

export interface CategorizationJobResult {
  success: boolean;
  categoryId: string | null;
  confidence: number;
  error?: string;
}

/**
 * Queue Names
 * Centralized queue name constants
 */
export const QUEUE_NAMES = {
  IMPORT: 'import',
  CATEGORIZATION: 'categorization',
} as const;

/**
 * Job Options
 * Default options for different job types
 */
export const JOB_OPTIONS = {
  IMPORT: {
    attempts: 3,
    backoff: {
      type: 'exponential' as const,
      delay: 2000, // Start with 2 seconds
    },
    removeOnComplete: {
      age: 24 * 60 * 60, // 24 hours in seconds
      count: 1000, // Keep max 1000 completed jobs
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60, // 7 days in seconds
    },
  },
  CATEGORIZATION: {
    attempts: 2, // Fewer retries for categorization
    backoff: {
      type: 'exponential' as const,
      delay: 1000,
    },
    removeOnComplete: {
      age: 12 * 60 * 60, // 12 hours
      count: 5000,
    },
    removeOnFail: {
      age: 3 * 24 * 60 * 60, // 3 days
    },
  },
} as const;
