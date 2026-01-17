/**
 * Import Feature Constants
 * Centralized configuration for file upload and processing limits
 */

/**
 * File upload limits
 */
export const FILE_UPLOAD = {
  /** Maximum file size in bytes (10MB) */
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  /** Maximum file size for display (10MB) */
  MAX_SIZE_MB: 10,
  /** Supported file types */
  ACCEPTED_TYPES: {
    CSV: 'text/csv',
    PDF: 'application/pdf',
  },
} as const;

/**
 * PDF processing limits
 */
export const PDF_PROCESSING = {
  /** Maximum number of pages to process */
  MAX_PAGES: 10,
  /** Default rendering scale for PDF to image conversion */
  DEFAULT_SCALE: 2.0,
  /** Maximum pages allowed in upload */
  MAX_UPLOAD_PAGES: 50,
} as const;

/**
 * AI processing limits
 */
export const AI_LIMITS = {
  /** Batch size for AI categorization to avoid token limits */
  CATEGORIZATION_BATCH_SIZE: 50,
  /** Maximum transactions per import */
  MAX_TRANSACTIONS_PER_IMPORT: 10000,
} as const;

/**
 * Balance validation limits
 */
export const BALANCE_LIMITS = {
  /** Maximum account balance (1 trillion COP) */
  MAX_BALANCE: 1_000_000_000_000,
  /** Minimum account balance (can be negative for debts) */
  MIN_BALANCE: -1_000_000_000_000,
} as const;
