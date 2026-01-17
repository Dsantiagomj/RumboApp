/**
 * Import Worker
 *
 * Background worker for processing file imports (CSV/PDF)
 * Listens to the import queue and processes jobs asynchronously
 *
 * Responsibilities:
 * 1. Download file from storage (Cloudflare R2)
 * 2. Parse file based on bank format
 * 3. Extract accounts and transactions
 * 4. Create ImportedAccount and ImportedTransaction records
 * 5. Update ImportJob status throughout process
 * 6. Queue categorization jobs for transactions
 * 7. Handle errors and retries
 */

import type { Job } from 'bullmq';
import { Worker } from 'bullmq';
import { ImportJobStatus } from '@prisma/client';
import { prisma } from '@/server/db';
import { QUEUE_NAMES } from '../types';
import type { ImportJobData, ImportJobResult } from '../types';
import { decryptPassword } from '@/server/lib/crypto';
import { decryptFile } from '@/server/lib/parsers/password-detector';

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
    const parsedData = await parseFile(fileBuffer, fileType, bankFormat);

    // Step 5: Create ImportedAccount records
    await updateJobStatus(jobId, ImportJobStatus.PARSING, 60);
    const accountsCount = await createImportedAccounts(jobId, parsedData.accounts);

    // Step 6: Create ImportedTransaction records
    await updateJobStatus(jobId, ImportJobStatus.PARSING, 80);
    const transactionsCount = await createImportedTransactions(jobId, parsedData.transactions);

    // Step 7: Queue categorization jobs
    await updateJobStatus(jobId, ImportJobStatus.CATEGORIZING, 90);
    const categorizationJobsQueued = await queueCategorizationJobs(userId, parsedData.transactions);

    // Step 8: Update ImportJob to REVIEW status
    await prisma.importJob.update({
      where: { id: jobId },
      data: {
        status: ImportJobStatus.REVIEW,
        progress: 100,
        accountsCount,
        transactionsCount,
        completedAt: new Date(),
      },
    });

    console.log(
      `[ImportWorker] Job ${jobId} completed: ${accountsCount} accounts, ${transactionsCount} transactions`
    );

    return {
      success: true,
      accountsCreated: accountsCount,
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
 * TODO: Implement actual download logic using R2 client
 */
async function downloadFile(_fileUrl: string): Promise<Buffer> {
  // Placeholder: In actual implementation, use R2 client to download file
  // console.log(`[ImportWorker] Downloading file from ${fileUrl}`);

  // TODO: Replace with actual R2 download
  // import { r2Client } from '@/server/lib/r2';
  // const response = await fetch(fileUrl);
  // if (!response.ok) throw new Error('Failed to download file');
  // return Buffer.from(await response.arrayBuffer());

  throw new Error('File download not implemented yet');
}

/**
 * Parse file based on type and bank format
 * TODO: Implement actual parsing logic
 */
async function parseFile(
  _fileBuffer: Buffer,
  _fileType: string,
  _bankFormat?: string
): Promise<{
  accounts: ParsedAccount[];
  transactions: ParsedTransaction[];
}> {
  // console.log(`[ImportWorker] Parsing ${fileType} file (${bankFormat || 'auto-detect'})`);

  // TODO: Implement actual parsing
  // if (fileType === 'CSV') {
  //   return parseCSV(fileBuffer, bankFormat);
  // } else if (fileType === 'PDF') {
  //   return parsePDF(fileBuffer, bankFormat);
  // }

  throw new Error('File parsing not implemented yet');
}

/**
 * Create ImportedAccount records
 * TODO: Implement actual account creation
 */
async function createImportedAccounts(_jobId: string, accounts: ParsedAccount[]): Promise<number> {
  console.log(`[ImportWorker] Creating ${accounts.length} imported accounts`);

  // TODO: Implement actual account creation
  // await prisma.importedAccount.createMany({
  //   data: accounts.map(account => ({
  //     importJobId: jobId,
  //     ...account
  //   }))
  // });

  return 0; // Placeholder
}

/**
 * Create ImportedTransaction records
 * TODO: Implement actual transaction creation
 */
async function createImportedTransactions(
  _jobId: string,
  transactions: ParsedTransaction[]
): Promise<number> {
  console.log(`[ImportWorker] Creating ${transactions.length} imported transactions`);

  // TODO: Implement actual transaction creation
  // await prisma.importedTransaction.createMany({
  //   data: transactions.map(tx => ({
  //     importJobId: jobId,
  //     ...tx
  //   }))
  // });

  return 0; // Placeholder
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
}

interface ParsedTransaction {
  id: string;
  importedAccountId: string;
  date: Date;
  description: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
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
