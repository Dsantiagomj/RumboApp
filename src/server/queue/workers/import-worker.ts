/**
 * Import Worker
 *
 * Background worker for processing file imports (CSV/PDF/Images)
 * Listens to the import queue and processes jobs asynchronously
 *
 * Responsibilities:
 * 1. Download file from storage (Cloudflare R2)
 * 2. Parse file based on type (CSV/PDF/Image with Vision API)
 * 3. Extract accounts and transactions
 * 4. Create ImportedAccount and ImportedTransaction records
 * 5. Update ImportJob status throughout process
 * 6. Queue categorization jobs for transactions
 * 7. Handle errors and retries
 */

import { randomUUID } from 'crypto';
import type { Job } from 'bullmq';
import { Worker } from 'bullmq';
import type { AccountType, TransactionType } from '@prisma/client';
import { ImportJobStatus } from '@prisma/client';
import { prisma } from '@/server/db';
import { QUEUE_NAMES } from '../types';
import type { ImportJobData, ImportJobResult } from '../types';
import { decryptPassword } from '@/server/lib/crypto';
import { decryptFile } from '@/server/lib/parsers/password-detector';
import {
  extractTransactionsFromImage,
  validateExtractionQuality,
} from '@/server/lib/vision/extract-transactions';
import { parseCSV, validateCSV } from '@/server/lib/parsers/csv-parser';
import { detectBankFormat, validateBankFormat } from '@/server/lib/parsers/bank-format-detector';
import {
  extractTransactions,
  validateTransactions,
} from '@/server/lib/parsers/transaction-extractor';
import { detectAccounts } from '@/server/lib/parsers/account-detector';

/**
 * Worker Configuration
 */
const WORKER_OPTIONS = {
  connection: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    maxRetriesPerRequest: 3,
  },
  concurrency: 5, // Process up to 5 import jobs concurrently
  limiter: {
    max: 10, // Maximum 10 jobs
    duration: 1000, // per second
  },
};

/**
 * Process import job
 * Main worker function that handles file import
 */
async function processImportJob(
  job: Job<ImportJobData, ImportJobResult>
): Promise<ImportJobResult> {
  const { jobId, userId, fileUrl, fileType, hasPassword, bankFormat } = job.data;

  console.log(`[ImportWorker] Processing job ${jobId} for user ${userId}`);

  try {
    // Step 1: Update ImportJob status to PROCESSING
    await updateJobStatus(jobId, ImportJobStatus.PROCESSING, 10);

    // Step 2: Validate job data and get ImportJob details
    const importJob = await validateJobData(job.data);

    // Step 3: Download file from storage
    await updateJobStatus(jobId, ImportJobStatus.PROCESSING, 20);
    let fileBuffer = await downloadFile(fileUrl);

    // Step 3.5: Handle password-protected files
    if (hasPassword && importJob.passwordHash) {
      console.log(`[ImportWorker] Decrypting password-protected file for job ${jobId}`);

      // Decrypt the stored password
      const password = decryptPassword(importJob.passwordHash);

      // Decrypt the file content
      fileBuffer = await decryptFile(fileBuffer, password, fileType as 'CSV' | 'PDF');

      // Clear the password from database for security
      await prisma.importJob.update({
        where: { id: jobId },
        data: { passwordHash: null },
      });

      console.log(`[ImportWorker] File decrypted and password cleared for job ${jobId}`);
    }

    // Step 4: Parse file based on type
    await updateJobStatus(jobId, ImportJobStatus.PARSING, 40);
    const parsedData = await parseFile(fileBuffer, fileType, jobId, bankFormat);

    // Step 5: Create ImportedAccount records
    await updateJobStatus(jobId, ImportJobStatus.PARSING, 60);
    const createdAccountIds = await createImportedAccounts(jobId, parsedData.accounts);

    // Build mapping from temporary IDs to real database IDs
    const accountIdMap = new Map<string, string>();
    parsedData.accounts.forEach((account, index) => {
      if (account.tempId) {
        accountIdMap.set(account.tempId, createdAccountIds[index]!);
      }
    });

    // Step 6: Create ImportedTransaction records
    await updateJobStatus(jobId, ImportJobStatus.PARSING, 80);
    const transactionsCount = await createImportedTransactions(
      jobId,
      parsedData.transactions,
      accountIdMap
    );

    // Step 7: Queue categorization jobs
    await updateJobStatus(jobId, ImportJobStatus.CATEGORIZING, 90);
    const categorizationJobsQueued = await queueCategorizationJobs(userId, parsedData.transactions);

    // Step 8: Update ImportJob to REVIEW status
    await prisma.importJob.update({
      where: { id: jobId },
      data: {
        status: ImportJobStatus.REVIEW,
        progress: 100,
        accountsCount: createdAccountIds.length,
        transactionsCount,
        completedAt: new Date(),
      },
    });

    console.log(
      `[ImportWorker] Job ${jobId} completed: ${createdAccountIds.length} accounts, ${transactionsCount} transactions`
    );

    return {
      success: true,
      accountsCreated: createdAccountIds.length,
      transactionsCreated: transactionsCount,
      categorizationJobsQueued,
    };
  } catch (error) {
    console.error(`[ImportWorker] Job ${jobId} failed:`, error);

    // Update ImportJob status to FAILED
    await prisma.importJob.update({
      where: { id: jobId },
      data: {
        status: ImportJobStatus.FAILED,
        error: error instanceof Error ? error.message : 'Unknown error during import',
      },
    });

    throw error; // Re-throw for BullMQ retry logic
  }
}

/**
 * Helper Functions
 */

/**
 * Update ImportJob status and progress
 */
async function updateJobStatus(
  jobId: string,
  status: ImportJobStatus,
  progress: number
): Promise<void> {
  await prisma.importJob.update({
    where: { id: jobId },
    data: { status, progress },
  });
}

/**
 * Validate job data before processing
 */
async function validateJobData(data: ImportJobData) {
  // Check if ImportJob exists
  const importJob = await prisma.importJob.findUnique({
    where: { id: data.jobId },
  });

  if (!importJob) {
    throw new Error(`ImportJob ${data.jobId} not found`);
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error(`User ${data.userId} not found`);
  }

  // Validate file URL
  if (!data.fileUrl || !data.fileUrl.startsWith('http')) {
    throw new Error('Invalid file URL');
  }

  return importJob;
}

/**
 * Download file from storage (Cloudflare R2)
 * Uses public R2 URL to fetch file
 */
async function downloadFile(fileUrl: string): Promise<Buffer> {
  console.log(`[ImportWorker] Downloading file from ${fileUrl}`);

  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Parse file based on type and bank format
 * Supports IMAGE (vision API), CSV, and PDF
 */
async function parseFile(
  fileBuffer: Buffer,
  fileType: string,
  jobId: string,
  _bankFormat?: string
): Promise<{
  accounts: ParsedAccount[];
  transactions: ParsedTransaction[];
}> {
  console.log(`[ImportWorker] Parsing ${fileType} file`);

  if (fileType === 'IMAGE') {
    // Use vision API for image processing
    const mimeType = 'image/jpeg'; // Default, could be improved by detecting actual type
    const visionResult = await extractTransactionsFromImage(fileBuffer, mimeType);

    // Validate extraction quality
    const validation = validateExtractionQuality(visionResult);
    if (!validation.isValid) {
      throw new Error(`Vision extraction failed validation: ${validation.errors.join(', ')}`);
    }

    // Convert vision result to ParsedAccount/ParsedTransaction format
    const accountIdMap = new Map<string, string>();

    const accounts: ParsedAccount[] = visionResult.accounts.map((account) => {
      const accountId = randomUUID();
      accountIdMap.set(account.name, accountId);

      return {
        name: account.name,
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        initialBalance: account.initialBalance,
        transactionCount: visionResult.transactions.length,
        tempId: accountId, // Store temp ID for mapping later
      };
    });

    // If no accounts detected, create a default one
    if (accounts.length === 0 && visionResult.transactions.length > 0) {
      const defaultAccountId = randomUUID();
      const defaultAccount: ParsedAccount = {
        name: 'Cuenta Importada',
        accountType: 'OTHER',
        initialBalance: 0,
        transactionCount: visionResult.transactions.length,
        tempId: defaultAccountId, // Store temp ID for mapping later
      };
      accounts.push(defaultAccount);
      accountIdMap.set('default', defaultAccountId);
    }

    const transactions: ParsedTransaction[] = visionResult.transactions.map((tx) => {
      // Find account ID (use first account if only one, otherwise default)
      const accountId =
        accounts.length === 1
          ? accountIdMap.values().next().value
          : accountIdMap.get('default') || randomUUID();

      return {
        id: randomUUID(),
        importedAccountId: accountId as string,
        date: new Date(tx.date),
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        merchant: tx.merchant,
        rawData: tx.rawData,
      };
    });

    return { accounts, transactions };
  } else if (fileType === 'CSV') {
    // Parse CSV with encoding detection
    console.log('[ImportWorker] Parsing CSV file with encoding detection');
    const csvResult = parseCSV(fileBuffer, {
      hasHeaders: true,
      skipEmptyLines: true,
      trimValues: true,
    });

    // Validate CSV structure
    const csvValidation = validateCSV(csvResult);
    if (!csvValidation.isValid) {
      throw new Error(`CSV validation failed: ${csvValidation.errors.join(', ')}`);
    }

    console.log(
      `[ImportWorker] CSV parsed: ${csvResult.rowCount} rows, ${csvResult.columnCount} columns, encoding: ${csvResult.encoding}`
    );

    // Detect bank format
    const formatDetection = detectBankFormat(csvResult);
    const detectedFormat = formatDetection.format;

    console.log(
      `[ImportWorker] Bank format detected: ${detectedFormat} (confidence: ${formatDetection.confidence.toFixed(2)})`
    );

    // Validate bank format
    const formatValidation = validateBankFormat(csvResult, detectedFormat);
    if (!formatValidation.isValid) {
      console.warn(
        `[ImportWorker] Bank format validation warnings: ${formatValidation.errors.join(', ')}`
      );
      // Continue anyway - these are warnings, not critical errors
    }

    // Extract transactions
    const extractedTransactions = extractTransactions(csvResult, formatDetection.detectedPattern);

    console.log(`[ImportWorker] Extracted ${extractedTransactions.length} transactions`);

    // Validate transactions
    const txValidation = validateTransactions(extractedTransactions);
    if (!txValidation.isValid) {
      throw new Error(`Transaction validation failed: ${txValidation.errors.join(', ')}`);
    }

    // Detect accounts
    const detectedAccounts = detectAccounts(
      csvResult,
      extractedTransactions,
      detectedFormat,
      undefined // fileName not available here, could be passed from job data
    );

    console.log(`[ImportWorker] Detected ${detectedAccounts.length} accounts`);

    // Update ImportJob with detected bank format
    await prisma.importJob.update({
      where: { id: jobId },
      data: { bankFormat: detectedFormat },
    });

    // Convert to ParsedAccount/ParsedTransaction format
    const accountIdMap = new Map<string, string>();

    const accounts: ParsedAccount[] = detectedAccounts.map((account) => {
      const accountId = randomUUID();
      accountIdMap.set(account.name, accountId);

      return {
        name: account.name,
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        initialBalance: account.initialBalance,
        transactionCount: account.transactionCount,
        tempId: accountId,
      };
    });

    const transactions: ParsedTransaction[] = extractedTransactions.map((tx) => {
      // Map transaction to the first account (for now)
      const accountId = accountIdMap.values().next().value as string;

      return {
        id: randomUUID(),
        importedAccountId: accountId,
        date: tx.date,
        description: tx.description,
        amount: tx.amount,
        type: tx.type,
        merchant: tx.merchant,
        rawData: tx.rawData,
      };
    });

    return { accounts, transactions };
  } else if (fileType === 'PDF') {
    // TODO: Implement PDF parsing
    throw new Error('PDF parsing not implemented yet');
  }

  throw new Error(`Unsupported file type: ${fileType}`);
}

/**
 * Create ImportedAccount records
 * Returns array of created account IDs in same order as input
 */
async function createImportedAccounts(jobId: string, accounts: ParsedAccount[]): Promise<string[]> {
  console.log(`[ImportWorker] Creating ${accounts.length} imported accounts`);

  if (accounts.length === 0) {
    return [];
  }

  // Create accounts one by one to get their IDs
  const createdIds: string[] = [];
  for (const account of accounts) {
    const created = await prisma.importedAccount.create({
      data: {
        importJobId: jobId,
        name: account.name,
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        accountType: account.accountType as AccountType,
        initialBalance: account.initialBalance,
        transactionCount: account.transactionCount,
      },
    });
    createdIds.push(created.id);
  }

  console.log(`[ImportWorker] Created ${createdIds.length} accounts`);
  return createdIds;
}

/**
 * Create ImportedTransaction records
 * Uses createMany for better performance with large transaction sets
 */
async function createImportedTransactions(
  jobId: string,
  transactions: ParsedTransaction[],
  accountIdMap: Map<string, string>
): Promise<number> {
  console.log(`[ImportWorker] Creating ${transactions.length} imported transactions`);

  if (transactions.length === 0) {
    return 0;
  }

  // Map temporary account IDs to real database IDs
  const transactionsWithRealIds = transactions.map((tx) => {
    const realAccountId = accountIdMap.get(tx.importedAccountId) || tx.importedAccountId;

    return {
      importJobId: jobId,
      importedAccountId: realAccountId,
      date: tx.date,
      description: tx.description,
      amount: tx.amount,
      type: tx.type,
      merchant: tx.merchant,
      rawData: tx.rawData ?? undefined,
    };
  });

  // Use createMany for bulk insert
  const result = await prisma.importedTransaction.createMany({
    data: transactionsWithRealIds,
  });

  console.log(`[ImportWorker] Created ${result.count} transactions`);
  return result.count;
}

/**
 * Queue categorization jobs for all transactions
 */
async function queueCategorizationJobs(
  _userId: string,
  transactions: ParsedTransaction[]
): Promise<number> {
  console.log(`[ImportWorker] Queueing ${transactions.length} categorization jobs`);

  // TODO: Implement actual categorization job queueing
  // for (const transaction of transactions) {
  //   await addCategorizationJob({
  //     transactionId: transaction.id,
  //     userId,
  //     description: transaction.description,
  //     amount: transaction.amount,
  //     merchant: transaction.merchant,
  //     type: transaction.type
  //   });
  // }

  return 0; // Placeholder
}

/**
 * Type Definitions for Parsed Data
 * TODO: Move to separate file if needed
 */

interface ParsedAccount {
  name: string;
  bankName?: string;
  accountNumber?: string;
  accountType: string;
  initialBalance: number;
  transactionCount: number;
  tempId?: string; // Temporary ID for mapping transactions
}

interface ParsedTransaction {
  id: string;
  importedAccountId: string; // References tempId from ParsedAccount
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  merchant?: string;
  rawData?: unknown;
}

/**
 * Create and start the worker
 */
export const importWorker = new Worker<ImportJobData, ImportJobResult>(
  QUEUE_NAMES.IMPORT,
  processImportJob,
  WORKER_OPTIONS
);

/**
 * Worker Event Handlers
 */
importWorker.on('completed', (job) => {
  console.log(`[ImportWorker] Job ${job.id} completed successfully`);
});

importWorker.on('failed', (job, error) => {
  console.error(`[ImportWorker] Job ${job?.id} failed:`, error.message);
});

importWorker.on('error', (error) => {
  console.error('[ImportWorker] Worker error:', error);
});

/**
 * Graceful Shutdown
 */
export const closeImportWorker = async (): Promise<void> => {
  await importWorker.close();
  console.log('[ImportWorker] Worker closed gracefully');
};

console.log('[ImportWorker] Worker started and listening for jobs');
