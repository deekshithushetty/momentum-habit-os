import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import completionRoutes from './routes/completionRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import { errorHandler, notFound } from './utils/errors.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(express.json({ limit: '1mb' }));
  app.use(compression());
  app.use(morgan(env.nodeEnv === 'test' ? 'tiny' : 'dev'));
  if (env.nodeEnv !== 'test') {
    app.use(rateLimit({ windowMs: 60 * 1000, limit: 240, standardHeaders: true, legacyHeaders: false }));
  }

  app.use('/api/v1/health', healthRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/habits', habitRoutes);
  app.use('/api/v1/completions', completionRoutes);
  app.use('/api/v1/tasks', taskRoutes);
  app.use('/api/v1/insights', insightRoutes);
  app.use('/api/v1/profile', profileRoutes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
