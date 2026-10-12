import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { connectRedis } from './config/redis.js';
import { env } from './config/env.js';

async function bootstrap() {
  await connectDatabase();
  await connectRedis();
  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Habit Tracker API listening on ${env.port}`);
  });
}

bootstrap().catch(err => {
  console.error('Server failed to start', err);
  process.exit(1);
});
