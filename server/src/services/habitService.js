import { Habit } from '../models/Habit.js';
import { Completion } from '../models/Completion.js';
import { addDays, daysBetween, scheduledOn, toDateKey } from '../utils/date.js';
import { calculateHabitStreaks } from '../utils/streaks.js';
import { getCache, keyFor, setCache } from './cacheService.js';

export async function listHabits(userId, includeArchived = false) {
  const key = keyFor(userId, 'habits', includeArchived ? 'all' : 'active');
  const cached = await getCache(key);
  if (cached) return cached;
  const query = { userId };
  if (!includeArchived) query.archivedAt = null;
  const habits = await Habit.find(query).sort({ createdAt: -1 }).lean();
  await setCache(key, habits, 90);
  return habits;
}

export async function dashboardSummary(user, dateKey = toDateKey(new Date(), user.preferences.timeZone)) {
  const key = keyFor(user._id, 'dashboard', dateKey);
  const cached = await getCache(key);
  if (cached) return cached;
  const habits = await Habit.find({ userId: user._id, archivedAt: null }).lean();
  const todayHabits = habits.filter(h => scheduledOn(h, dateKey));
  const completions = await Completion.find({ userId: user._id, dateKey }).lean();
  const completedIds = new Set(completions.map(c => String(c.habitId)));
  const monthStart = dateKey.slice(0, 8) + '01';
  const history = await Completion.find({ userId: user._id, dateKey: { $gte: monthStart, $lte: dateKey } }).lean();
  const byHabit = history.reduce((acc, item) => {
    const id = String(item.habitId);
    acc[id] ||= [];
    acc[id].push(item.dateKey);
    return acc;
  }, {});
  const streaks = habits.map(h => calculateHabitStreaks(h, byHabit[String(h._id)] || [], dateKey));
  const weekKeys = daysBetween(addDays(dateKey, -6), dateKey);
  const weekly = weekKeys.map(key => {
    const scheduled = habits.filter(h => scheduledOn(h, key)).length;
    const completed = history.filter(c => c.dateKey === key).length;
    return { dateKey: key, scheduled, completed, rate: scheduled ? Math.round((completed / scheduled) * 100) : 0 };
  });
  const summary = {
    dateKey,
    totals: {
      scheduled: todayHabits.length,
      completed: todayHabits.filter(h => completedIds.has(String(h._id))).length,
      remaining: todayHabits.filter(h => !completedIds.has(String(h._id))).length
    },
    todayHabits: todayHabits.map(h => ({ ...h, completed: completedIds.has(String(h._id)) })),
    currentStreak: Math.max(0, ...streaks.map(s => s.current)),
    longestStreak: Math.max(0, ...streaks.map(s => s.longest)),
    weekly,
    motivational: 'Small wins compound. Finish one useful thing today.'
  };
  summary.totals.rate = summary.totals.scheduled ? Math.round((summary.totals.completed / summary.totals.scheduled) * 100) : 0;
  await setCache(key, summary, 45);
  return summary;
}
