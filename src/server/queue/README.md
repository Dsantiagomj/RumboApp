# BullMQ Queue Infrastructure

This directory contains the BullMQ queue infrastructure for processing background jobs asynchronously.

## Architecture

```
src/server/queue/
├── index.ts                    # Main exports
├── types.ts                    # TypeScript type definitions
├── queues.ts                   # Queue instances and configuration
├── workers/
│   └── import-worker.ts        # Import job processor
└── README.md                   # This file
```

## Queues

### 1. Import Queue

Processes file imports (CSV/PDF) from bank statements.

**Job Data:** `ImportJobData`

```typescript
{
  jobId: string;           // ImportJob ID from database
  userId: string;          // User ID
  fileUrl: string;         // File URL in Cloudflare R2
  fileType: 'CSV' | 'PDF'; // File type
  hasPassword?: boolean;   // For encrypted PDFs
  bankFormat?: BankFormat; // Bank format (auto-detected if not provided)
}
```

**Flow:**

1. User uploads file → Upload service creates ImportJob record
2. Upload service adds job to importQueue
3. Import worker downloads file from R2
4. Worker parses file (CSV/PDF)
5. Worker creates ImportedAccount and ImportedTransaction records
6. Worker updates ImportJob status (PENDING → PROCESSING → PARSING → CATEGORIZING → REVIEW)
7. Worker queues categorization jobs for each transaction

### 2. Categorization Queue

Processes AI-powered transaction categorization using OpenAI.

**Job Data:** `CategorizationJobData`

```typescript
{
  transactionId: string; // ImportedTransaction ID
  userId: string;        // User ID for custom categories
  description: string;   // Transaction description
  amount: number;        // Transaction amount
  merchant?: string;     // Merchant name
  type: 'INCOME' | 'EXPENSE';
}
```

**Flow:**

1. Import worker creates ImportedTransaction
2. Import worker queues categorization job
3. Categorization worker uses OpenAI to analyze description
4. Worker suggests category and confidence score
5. Worker updates ImportedTransaction with suggestions

## Usage

### Adding Jobs to Queue

```typescript
import { addImportJob, addCategorizationJob } from '@/server/queue';

// Add import job
await addImportJob({
  jobId: 'import_123',
  userId: 'user_456',
  fileUrl: 'https://r2.cloudflare.com/file.csv',
  fileType: 'CSV',
  bankFormat: 'BANCOLOMBIA',
});

// Add categorization job
await addCategorizationJob({
  transactionId: 'tx_789',
  userId: 'user_456',
  description: 'PAGO EN EXITO',
  amount: 50000,
  type: 'EXPENSE',
});
```

### Monitoring Queue Stats

```typescript
import { getQueueStats } from '@/server/queue';

const stats = await getQueueStats();
console.log(stats);
// {
//   import: { waiting: 5, active: 2, completed: 100, failed: 3 },
//   categorization: { waiting: 50, active: 10, completed: 500, failed: 5 }
// }
```

### Graceful Shutdown

```typescript
import { closeQueues, closeImportWorker } from '@/server/queue';

// On application shutdown
await closeQueues();
await closeImportWorker();
```

## Configuration

### Environment Variables

```bash
# Redis connection (required)
REDIS_URL="redis://:password@localhost:6379"

# For Upstash (optional)
REDIS_TOKEN=""
```

### Queue Options

Configured in `src/server/queue/types.ts`:

**Import Queue:**

- Attempts: 3
- Backoff: Exponential (starts at 2s)
- Remove completed: After 24 hours
- Remove failed: After 7 days

**Categorization Queue:**

- Attempts: 2
- Backoff: Exponential (starts at 1s)
- Remove completed: After 12 hours
- Remove failed: After 3 days

### Worker Options

Configured in `src/server/queue/workers/import-worker.ts`:

- Concurrency: 5 jobs in parallel
- Rate limit: 10 jobs per second

## Workers

### Running Workers

Workers can run in the same process as the Next.js app or as standalone processes.

#### Option 1: Embedded Workers (Development)

Workers automatically start when imported:

```typescript
// In your Next.js API route or initialization
import '@/server/queue/workers/import-worker';
```

#### Option 2: Standalone Workers (Production)

Create a separate worker process:

```typescript
// workers.ts (standalone file)
import { importWorker } from '@/server/queue/workers/import-worker';

process.on('SIGTERM', async () => {
  await importWorker.close();
  process.exit(0);
});
```

Run with:

```bash
node workers.ts
```

Or with PM2:

```bash
pm2 start workers.ts --name "queue-workers"
```

## Development Status

### ✅ Completed

- Redis connection singleton
- Queue instances (import, categorization)
- TypeScript type definitions
- Import worker structure
- Error handling and retry logic
- Status tracking

### 🚧 TODO (Next Steps)

1. Implement file download from R2
2. Implement CSV parser (Bancolombia, Nequi, etc.)
3. Implement PDF parser with password support
4. Implement categorization worker with OpenAI
5. Add job progress updates
6. Add webhook notifications for job completion
7. Create admin dashboard for queue monitoring
8. Add dead letter queue for failed jobs
9. Implement job retry strategies
10. Add comprehensive tests

## Monitoring

### Queue Dashboard

For development, you can use BullMQ Board:

```bash
npm install -g bull-board
bull-board --redis redis://localhost:6379
```

### Logging

All queue events are logged to console:

- Job added: `[ImportQueue] Job xyz is waiting`
- Job started: `[ImportQueue] Job xyz started processing`
- Job completed: `[ImportQueue] Job xyz completed successfully`
- Job failed: `[ImportQueue] Job xyz failed: error message`

### Metrics

Get queue statistics:

```typescript
import { getQueueStats } from '@/server/queue';

const stats = await getQueueStats();
```

## Error Handling

### Automatic Retries

Jobs are automatically retried with exponential backoff:

- Import jobs: 3 attempts (2s, 4s, 8s)
- Categorization jobs: 2 attempts (1s, 2s)

### Failed Jobs

Failed jobs are kept for 7 days for debugging:

- Check error message in ImportJob.error field
- Review job data in BullMQ dashboard
- Manually retry from dashboard if needed

### Common Errors

1. **File download failed**: Check R2 credentials and file URL
2. **Parse error**: Check file format and bank format detection
3. **Database error**: Check Prisma connection and schema
4. **AI categorization failed**: Check OpenAI API key and quota

## Testing

```bash
# Run all tests
npm test

# Run queue tests only
npm test -- queue

# Watch mode
npm test -- --watch
```

## Production Deployment

### Redis Setup

Use managed Redis service:

- **Upstash Redis**: Serverless, pay-per-request
- **Redis Cloud**: Managed Redis with high availability
- **AWS ElastiCache**: For AWS deployments

### Worker Deployment

#### Option 1: Vercel (Serverless)

Workers run in API routes (limited to 10s execution):

```typescript
// pages/api/jobs/process.ts
import { importWorker } from '@/server/queue/workers/import-worker';
```

#### Option 2: Separate Worker Process

Deploy workers on long-running servers:

- Railway
- Render
- Fly.io
- AWS ECS/Fargate

### Scaling

- **Horizontal scaling**: Run multiple worker instances
- **Vertical scaling**: Increase worker concurrency
- **Queue partitioning**: Separate queues by priority/type

## Resources

- [BullMQ Documentation](https://docs.bullmq.io/)
- [ioredis Documentation](https://github.com/redis/ioredis)
- [Redis Best Practices](https://redis.io/docs/manual/patterns/)
