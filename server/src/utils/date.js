const DAY = 24 * 60 * 60 * 1000;

export function toDateKey(date = new Date(), timeZone = 'UTC') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return `${map.year}-${map.month}-${map.day}`;
}

export function parseDateKey(key) {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDays(key, delta) {
  return toDateKey(new Date(parseDateKey(key).getTime() + delta * DAY), 'UTC');
}

export function daysBetween(startKey, endKey) {
  const days = [];
  for (let d = parseDateKey(startKey); d <= parseDateKey(endKey); d = new Date(d.getTime() + DAY)) {
    days.push(toDateKey(d, 'UTC'));
  }
  return days;
}

export function weekdayForDateKey(key) {
  return parseDateKey(key).getUTCDay();
}

export function scheduledOn(habit, key) {
  if (habit.archivedAt || habit.paused) return false;
  if (habit.startDate && key < habit.startDate) return false;
  if (habit.endDate && key > habit.endDate) return false;
  const weekday = weekdayForDateKey(key);
  return habit.schedule?.daysOfWeek?.includes(weekday);
}
