import { redisClient, cacheMetrics } from '../config/redis.js';

const prefix = 'habit-tracker:v1';

export function keyFor(userId, name, suffix = '') {
  return `${prefix}:user:${userId}:${name}${suffix ? `:${suffix}` : ''}`;
}

export async function getCache(key) {
  const client = redisClient();
  if (!client) return null;
  try {
    const raw = await client.get(key);
    if (!raw) {
      cacheMetrics.misses += 1;
      return null;
    }
    cacheMetrics.hits += 1;
    return JSON.parse(raw);
  } catch {
    cacheMetrics.errors += 1;
    return null;
  }
}

export async function setCache(key, value, ttlSeconds) {
  const client = redisClient();
  if (!client) return;
  try {
    await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
    cacheMetrics.sets += 1;
  } catch {
    cacheMetrics.errors += 1;
  }
}

export async function invalidateUserCache(userId) {
  const client = redisClient();
  if (!client) return;
  try {
    const keys = await client.keys(`${prefix}:user:${userId}:*`);
    if (keys.length) await client.del(keys);
    cacheMetrics.invalidations += keys.length;
  } catch {
    cacheMetrics.errors += 1;
  }
}
