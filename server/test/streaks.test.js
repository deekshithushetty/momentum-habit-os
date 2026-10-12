import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHabitStreaks } from '../src/utils/streaks.js';

test('calculates scheduled-day streaks', () => {
  const habit = { schedule: { daysOfWeek: [1, 2, 3, 4, 5] } };
  const result = calculateHabitStreaks(habit, ['2026-10-08', '2026-10-09', '2026-10-12'], '2026-10-12');
  assert.equal(result.current, 3);
  assert.equal(result.longest, 3);
});

test('breaks current streak on missed scheduled day', () => {
  const habit = { schedule: { daysOfWeek: [0, 1, 2, 3, 4, 5, 6] } };
  const result = calculateHabitStreaks(habit, ['2026-10-10', '2026-10-12'], '2026-10-12');
  assert.equal(result.current, 1);
});
