import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

test('health endpoint returns cache metrics shape', async () => {
  process.env.NODE_ENV = 'test';
  const { createApp } = await import('../src/app.js');
  const res = await request(createApp()).get('/api/v1/health').expect(200);
  assert.equal(res.body.ok, true);
  assert.ok(res.body.cacheMetrics);
});
