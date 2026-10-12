import test from 'node:test';
import assert from 'node:assert/strict';
import { completionRate } from './streakPreview.js';

test('completionRate handles empty schedule', () => {
  assert.equal(completionRate(4, 0), 0);
});

test('completionRate rounds percentages', () => {
  assert.equal(completionRate(2, 3), 67);
});
