import Redis from 'ioredis';

/**
 * Singleton Redis client for BullMQ queues and general caching
 *
 * Configuration:
 * - REDIS_URL: Connection URL (default: redis://localhost:6379)
 *   Format: redis://[:password@]host[:port][/db]
 *
 * For production:
 * - Use managed Redis (Upstash, Redis Cloud, AWS ElastiCache)
 * - Enable TLS for secure connections
 * - Set strong password authentication
 *
 * Connection features:
 * - Auto-reconnect with exponential backoff
 * - Connection error handling
 * - Lazy initialization (connects on first use)
 * - Singleton pattern for reuse across application
 */

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

/**
 * Get or create Redis client instance
 * Implements singleton pattern to ensure single connection
 */
export const getRedisClient = (): Redis => {
  if (!globalForRedis.redis) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    // Create Redis client with connection options
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times: number) {
        // Exponential backoff for retries
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      lazyConnect: false, // Connect immediately
    });

    // Error handling
    redis.on('error', (error) => {
      console.error('[Redis] Connection error:', error.message);
      // Don't throw - let retryStrategy handle reconnection
    });

    redis.on('connect', () => {
      console.log('[Redis] Connected successfully');
    });

    redis.on('ready', () => {
      console.log('[Redis] Ready to accept commands');
    });

    redis.on('reconnecting', (delay: number) => {
      console.log(`[Redis] Reconnecting in ${delay}ms...`);
    });

    redis.on('close', () => {
      console.log('[Redis] Connection closed');
    });

    globalForRedis.redis = redis;
  }

  return globalForRedis.redis;
};

/**
 * Default Redis client instance
 * Usage: import { redis } from '@/server/lib/redis'
 */
export const redis = getRedisClient();

/**
 * Validate Redis connection
 * Useful for health checks and startup validation
 */
export const validateRedisConnection = async (): Promise<boolean> => {
  try {
    const client = getRedisClient();
    await client.ping();
    return true;
  } catch (error) {
    console.error('[Redis] Connection validation failed:', error);
    return false;
  }
};

/**
 * Gracefully close Redis connection
 * Should be called on application shutdown
 */
export const closeRedisConnection = async (): Promise<void> => {
  if (globalForRedis.redis) {
    await globalForRedis.redis.quit();
    globalForRedis.redis = undefined;
    console.log('[Redis] Connection closed gracefully');
  }
};
