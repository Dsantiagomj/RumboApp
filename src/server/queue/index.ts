/**
 * Queue Module
 *
 * Centralized exports for BullMQ queues and workers
 * Makes it easier to import queue functionality throughout the application
 */

// Queue instances
export {
  importQueue,
  categorizationQueue,
  addImportJob,
  addCategorizationJob,
  getQueueStats,
  closeQueues,
} from './queues';

// Types
export type {
  ImportJobData,
  CategorizationJobData,
  ImportJobResult,
  CategorizationJobResult,
} from './types';

export { QUEUE_NAMES, JOB_OPTIONS } from './types';

// Workers (export for standalone worker processes)
export { importWorker, closeImportWorker } from './workers/import-worker';
