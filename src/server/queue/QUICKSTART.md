# BullMQ Queue Quick Start Guide

## Prerequisites

1. Redis server running
2. Environment variables configured

## Setup

### 1. Start Redis (Local Development)

Using Docker (recommended):

```bash
docker-compose up -d redis
```

Or install Redis locally:

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis
```

### 2. Configure Environment Variables

Ensure `.env` has:

```bash
REDIS_URL="redis://:your-password@localhost:6379"
```

For local development without password:

```bash
REDIS_URL="redis://localhost:6379"
```

### 3. Verify Redis Connection

```typescript
import { validateRedisConnection } from '@/server/lib/redis';

const isConnected = await validateRedisConnection();
console.log('Redis connected:', isConnected);
```

## Using the Queues

### Adding Import Jobs

```typescript
import { addImportJob } from '@/server/queue';

// After uploading file to R2 and creating ImportJob in database
await addImportJob({
  jobId: importJob.id,
  userId: user.id,
  fileUrl: fileUrl,
  fileType: 'CSV',
  bankFormat: 'BANCOLOMBIA',
});
```

### Starting Workers

#### Development (Embedded)

Add to your Next.js initialization (e.g., `src/server/init.ts`):

```typescript
// Start workers in development
if (process.env.NODE_ENV === 'development') {
  import('@/server/queue/workers/import-worker');
}
```

#### Production (Standalone)

Create `workers.ts` in project root:

```typescript
import { importWorker } from '@/server/queue/workers/import-worker';

console.log('Workers started');

process.on('SIGTERM', async () => {
  await importWorker.close();
  process.exit(0);
});
```

Run with:

```bash
node workers.ts
```

### Monitoring

Check queue stats:

```typescript
import { getQueueStats } from '@/server/queue';

const stats = await getQueueStats();
console.log(stats);
```

## Testing

Test Redis connection:

```bash
redis-cli ping
# Should return: PONG
```

Test queue functionality:

```typescript
import { addImportJob } from '@/server/queue';

// Add a test job
const job = await addImportJob({
  jobId: 'test-123',
  userId: 'user-456',
  fileUrl: 'https://example.com/test.csv',
  fileType: 'CSV',
});

console.log('Job added:', job.id);
```

## Troubleshooting

### Redis Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:6379
```

**Solution:** Start Redis server

```bash
docker-compose up -d redis
# or
brew services start redis
```

### Authentication Error

```
Error: NOAUTH Authentication required
```

**Solution:** Add password to REDIS_URL

```bash
REDIS_URL="redis://:your-password@localhost:6379"
```

### Worker Not Processing Jobs

**Solution:** Ensure worker is running

```typescript
import '@/server/queue/workers/import-worker';
```

### Jobs Stuck in Queue

**Solution:** Check worker logs and Redis connection

```bash
redis-cli llen "bull:import:wait"
```

## Next Steps

1. Implement file parsing logic in import worker
2. Implement categorization worker
3. Add progress tracking
4. Set up monitoring dashboard
5. Configure production Redis

## Resources

- [BullMQ Docs](https://docs.bullmq.io/)
- [Redis Docs](https://redis.io/docs/)
- [Full Documentation](./README.md)
