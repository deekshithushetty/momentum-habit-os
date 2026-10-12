import { addDays, scheduledOn } from './date.js';

function previousScheduledDate(habit, key) {
  let cursor = addDays(key, -1);
  for (let guard = 0; guard < 730; guard += 1) {
    if (scheduledOn(habit, cursor)) return cursor;
    cursor = addDays(cursor, -1);
  }
  return null;
}

export function calculateHabitStreaks(habit, completionKeys, todayKey) {
  const complete = new Set(completionKeys);
  let current = 0;
  let cursor = todayKey;
  for (let guard = 0; guard < 730; guard += 1) {
    if (!scheduledOn(habit, cursor)) {
      cursor = addDays(cursor, -1);
      continue;
    }
    if (!complete.has(cursor)) break;
    current += 1;
    cursor = addDays(cursor, -1);
  }

  let longest = 0;
  let run = 0;
  const ordered = [...completionKeys].sort();
  let last = null;
  for (const key of ordered) {
    if (!scheduledOn(habit, key)) continue;
    run = last && previousScheduledDate(habit, key) === last ? run + 1 : 1;
    longest = Math.max(longest, run);
    last = key;
  }
  return { current, longest };
}
