/**
 * Queue Usage Examples
 *
 * This file demonstrates how to use the BullMQ queue infrastructure
 * for import and categorization jobs.
 *
 * NOTE: These are examples only - not meant to be executed directly
 */

import { addImportJob, addCategorizationJob, getQueueStats } from './index';
import type { ImportJobData, CategorizationJobData } from './types';

/**
 * Example 1: Add Import Job
 *
 * Called when user uploads a CSV or PDF file
 * Typically called from the file upload API endpoint
 */
export async function exampleAddImportJob() {
  const jobData: ImportJobData = {
    jobId: 'clu123abc', // ImportJob ID from Prisma
    userId: 'cluser456', // User ID
    fileUrl: 'https://pub-abc123.r2.dev/uploads/statement.csv',
    fileType: 'CSV',
    bankFormat: 'BANCOLOMBIA', // Optional, can be auto-detected
  };

  const job = await addImportJob(jobData);

  console.log(`Import job added with ID: ${job.id}`);
  console.log(`Job will be processed by import worker`);

  return job;
}

/**
 * Example 2: Add Import Job for Password-Protected PDF
 *
 * For PDFs that require a password
 */
export async function exampleAddProtectedPDFImportJob() {
  const jobData: ImportJobData = {
    jobId: 'clu789xyz',
    userId: 'cluser456',
    fileUrl: 'https://pub-abc123.r2.dev/uploads/statement.pdf',
    fileType: 'PDF',
    hasPassword: true, // Worker will need to handle password
  };

  const job = await addImportJob(jobData);

  return job;
}

/**
 * Example 3: Add Categorization Job
 *
 * Called by import worker after creating ImportedTransaction
 * Can also be called manually to re-categorize a transaction
 */
export async function exampleAddCategorizationJob() {
  const jobData: CategorizationJobData = {
    transactionId: 'clitx123', // ImportedTransaction ID
    userId: 'cluser456',
    description: 'PAGO EN EXITO SUPERMERCADO',
    amount: 150000,
    merchant: 'EXITO',
    type: 'EXPENSE',
  };

  const job = await addCategorizationJob(jobData);

  console.log(`Categorization job added with ID: ${job.id}`);

  return job;
}

/**
 * Example 4: Batch Add Categorization Jobs
 *
 * Called by import worker to categorize all transactions from an import
 */
export async function exampleBatchAddCategorizationJobs(
  transactions: Array<{
    id: string;
    description: string;
    amount: number;
    merchant?: string;
    type: 'INCOME' | 'EXPENSE';
  }>,
  userId: string
) {
  const jobs = await Promise.all(
    transactions.map((tx) =>
      addCategorizationJob({
        transactionId: tx.id,
        userId,
        description: tx.description,
        amount: tx.amount,
        merchant: tx.merchant,
        type: tx.type,
      })
    )
  );

  console.log(`Added ${jobs.length} categorization jobs`);

  return jobs;
}

/**
 * Example 5: Get Queue Statistics
 *
 * Useful for admin dashboards and monitoring
 */
export async function exampleGetQueueStats() {
  const stats = await getQueueStats();

  console.log('Import Queue Stats:', stats.import);
  // {
  //   waiting: 5,      // Jobs waiting to be processed
  //   active: 2,       // Jobs currently being processed
  //   completed: 100,  // Completed jobs (before cleanup)
  //   failed: 3,       // Failed jobs
  //   delayed: 0,      // Delayed jobs (scheduled for future)
  //   paused: 0        // Paused jobs
  // }

  console.log('Categorization Queue Stats:', stats.categorization);

  return stats;
}

/**
 * Example 6: API Route Integration
 *
 * How to use queues in a Next.js API route
 */
export async function exampleAPIRouteUsage() {
  // Example: POST /api/imports/upload
  // After uploading file to R2 and creating ImportJob record

  const importJob = {
    id: 'clu123abc',
    userId: 'cluser456',
    fileUrl: 'https://r2.dev/file.csv',
    fileType: 'CSV' as const,
  };

  // Add job to queue
  await addImportJob({
    jobId: importJob.id,
    userId: importJob.userId,
    fileUrl: importJob.fileUrl,
    fileType: importJob.fileType,
  });

  // Return response immediately
  // Worker will process in background
  return {
    success: true,
    message: 'Import job queued for processing',
    importJobId: importJob.id,
  };
}

/**
 * Example 7: Worker Result Handling
 *
 * How to check job results after completion
 */
export async function exampleCheckJobResult(jobId: string) {
  const { importQueue } = await import('./queues');

  const job = await importQueue.getJob(jobId);

  if (!job) {
    return { error: 'Job not found' };
  }

  const state = await job.getState();

  if (state === 'completed') {
    const result = job.returnvalue;
    console.log('Job completed successfully:', result);
    return result;
  } else if (state === 'failed') {
    console.log('Job failed:', job.failedReason);
    return { error: job.failedReason };
  } else {
    console.log(`Job is ${state}`);
    return { state };
  }
}

/**
 * Example 8: Manual Job Retry
 *
 * Retry a failed job manually
 */
export async function exampleRetryFailedJob(jobId: string) {
  const { importQueue } = await import('./queues');

  const job = await importQueue.getJob(jobId);

  if (!job) {
    throw new Error('Job not found');
  }

  const state = await job.getState();

  if (state === 'failed') {
    await job.retry();
    console.log(`Job ${jobId} queued for retry`);
  } else {
    console.log(`Job is ${state}, cannot retry`);
  }
}

/**
 * Example 9: Job Progress Monitoring
 *
 * Monitor job progress in real-time
 */
export async function exampleMonitorJobProgress(jobId: string) {
  const { importQueue } = await import('./queues');

  const job = await importQueue.getJob(jobId);

  if (!job) {
    throw new Error('Job not found');
  }

  // Get current progress
  const progress = job.progress;
  console.log(`Job progress: ${progress}%`);

  // Listen for progress updates
  importQueue.on('progress', (job, progress) => {
    if (job.id === jobId) {
      console.log(`Job ${jobId} progress: ${progress}%`);
    }
  });
}

/**
 * Example 10: Cleanup Old Jobs
 *
 * Manually clean up old completed/failed jobs
 */
export async function exampleCleanupJobs() {
  const { importQueue, categorizationQueue } = await import('./queues');

  // Clean completed jobs older than 1 day
  await importQueue.clean(24 * 60 * 60 * 1000, 1000, 'completed');

  // Clean failed jobs older than 7 days
  await importQueue.clean(7 * 24 * 60 * 60 * 1000, 1000, 'failed');

  // Same for categorization queue
  await categorizationQueue.clean(12 * 60 * 60 * 1000, 1000, 'completed');
  await categorizationQueue.clean(3 * 24 * 60 * 60 * 1000, 1000, 'failed');

  console.log('Job cleanup completed');
}
