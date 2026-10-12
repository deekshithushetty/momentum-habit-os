import { createClient } from 'redis';
import { env } from './env.js';

let client;
export const cacheMetrics = { hits: 0, misses: 0, sets: 0, invalidations: 0, errors: 0 };

export async function connectRedis() {
  if (!env.redisUrl) return null;
  client = createClient({
    url: env.redisUrl,
    socket: { reconnectStrategy: retries => Math.min(retries * 100, 1000) }
  });
  client.on('error', () => { cacheMetrics.errors += 1; });
  try {
    await client.connect();
    return client;
  } catch {
    cacheMetrics.errors += 1;
    client = null;
    return null;
  }
}

export function redisClient() {
  return client?.isOpen ? client : null;
}
