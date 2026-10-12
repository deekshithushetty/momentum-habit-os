import { Router } from 'express';
import mongoose from 'mongoose';
import { redisClient, cacheMetrics } from '../config/redis.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({
    ok: true,
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: redisClient() ? 'connected' : 'unavailable',
    cacheMetrics
  });
});

export default router;
