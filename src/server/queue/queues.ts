/**
 * BullMQ Queue Instances
 *
 * Centralized queue creation and configuration
 * Queues are used to process background jobs asynchronously
 */

import { Queue } from 'bullmq';
import {
  QUEUE_NAMES,
  JOB_OPTIONS,
  type ImportJobData,
  type CategorizationJobData,
  type ImportJobResult,
  type CategorizationJobResult,
} from './types';

/**
 * Shared Redis connection configuration for BullMQ
 * Using connection string for better type compatibility
 */
const connection = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  maxRetriesPerRequest: 3,
};

/**
 * Import Queue
 *
 * Processes file imports (CSV/PDF)
 * - Parses bank statements
 * - Extracts accounts and transactions
 * - Creates ImportedAccount and ImportedTransaction records
 * - Triggers categorization jobs for each transaction
 *
 * Job Data: ImportJobData
 * Result: ImportJobResult
 */
export const importQueue = new Queue<ImportJobData, ImportJobResult>(QUEUE_NAMES.IMPORT, {
  connection,
  defaultJobOptions: JOB_OPTIONS.IMPORT,
});

/**
 * Categorization Queue
 *
 * Processes AI-powered transaction categorization
 * - Uses OpenAI to analyze transaction descriptions
 * - Suggests appropriate category based on user's categories
 * - Updates ImportedTransaction with category suggestion and confidence
 *
 * Job Data: CategorizationJobData
 * Result: CategorizationJobResult
 */
export const categorizationQueue = new Queue<CategorizationJobData, CategorizationJobResult>(
  QUEUE_NAMES.CATEGORIZATION,
  {
    connection,
    defaultJobOptions: JOB_OPTIONS.CATEGORIZATION,
  }
);

/**
 * Queue Event Handlers
 * Global event listeners for monitoring queue health
 */

// Import Queue Events
importQueue.on('error', (error: Error) => {
  console.error('[ImportQueue] Error:', error);
});

// Note: Queue events are different from Worker events
// These events are emitted by the Queue, not the Worker
// For detailed job processing events, use Worker event listeners

// Categorization Queue Events
categorizationQueue.on('error', (error: Error) => {
  console.error('[CategorizationQueue] Error:', error);
});

/**
 * Graceful Shutdown
 * Close queues on application shutdown
 */
export const closeQueues = async (): Promise<void> => {
  await Promise.all([importQueue.close(), categorizationQueue.close()]);
  console.log('[Queues] All queues closed gracefully');
};

/**
 * Helper Functions
 */

/**
 * Add import job to queue
 * Convenience function with proper typing
 */
export const addImportJob = async (data: ImportJobData) => {
  return await importQueue.add('import-file', data, {
    jobId: data.jobId, // Use ImportJob ID as BullMQ job ID for easy tracking
  });
};

/**
 * Add categorization job to queue
 * Convenience function with proper typing
 */
export const addCategorizationJob = async (data: CategorizationJobData) => {
  return await categorizationQueue.add('categorize-transaction', data, {
    jobId: data.transactionId, // Use transaction ID as job ID
  });
};

/**
 * Get queue statistics
 * Useful for monitoring and admin dashboards
 */
export const getQueueStats = async () => {
  const [importStats, categorizationStats] = await Promise.all([
    importQueue.getJobCounts(),
    categorizationQueue.getJobCounts(),
  ]);

  return {
    import: importStats,
    categorization: categorizationStats,
  };
};
