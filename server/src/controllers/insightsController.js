import { Habit } from '../models/Habit.js';
import { Completion } from '../models/Completion.js';
import { daysBetween, scheduledOn, toDateKey } from '../utils/date.js';
import { calculateHabitStreaks } from '../utils/streaks.js';
import { getCache, keyFor, setCache } from '../services/cacheService.js';

export async function insights(req, res, next) {
  try {
    const end = req.query.end || toDateKey(new Date(), req.user.preferences.timeZone);
    const start = req.query.start || `${end.slice(0, 8)}01`;
    const key = keyFor(req.user._id, 'insights', `${start}:${end}`);
    const cached = await getCache(key);
    if (cached) return res.json({ insights: cached });

    const habits = await Habit.find({ userId: req.user._id, archivedAt: null }).lean();
    const completions = await Completion.find({ userId: req.user._id, dateKey: { $gte: start, $lte: end } }).lean();
    const dateKeys = daysBetween(start, end);
    const completionSet = new Set(completions.map(c => `${c.habitId}:${c.dateKey}`));
    const daily = dateKeys.map(dateKey => {
      const scheduled = habits.filter(h => scheduledOn(h, dateKey)).length;
      const completed = habits.filter(h => scheduledOn(h, dateKey) && completionSet.has(`${h._id}:${dateKey}`)).length;
      return { dateKey, scheduled, completed, rate: scheduled ? Math.round((completed / scheduled) * 100) : 0 };
    });
    const habitPerformance = habits.map(habit => {
      const scheduled = dateKeys.filter(d => scheduledOn(habit, d)).length;
      const completed = completions.filter(c => String(c.habitId) === String(habit._id)).length;
      const streaks = calculateHabitStreaks(habit, completions.filter(c => String(c.habitId) === String(habit._id)).map(c => c.dateKey), end);
      return { habitId: habit._id, title: habit.title, color: habit.color, scheduled, completed, rate: scheduled ? Math.round((completed / scheduled) * 100) : 0, ...streaks };
    });
    const weekday = Array.from({ length: 7 }, (_, day) => {
      const matching = daily.filter(d => new Date(`${d.dateKey}T00:00:00Z`).getUTCDay() === day);
      const completed = matching.reduce((sum, d) => sum + d.completed, 0);
      const scheduled = matching.reduce((sum, d) => sum + d.scheduled, 0);
      return { day, scheduled, completed, rate: scheduled ? Math.round((completed / scheduled) * 100) : 0 };
    });
    const payload = { start, end, daily, habitPerformance, weekday };
    await setCache(key, payload, 180);
    res.json({ insights: payload });
  } catch (err) {
    next(err);
  }
}
