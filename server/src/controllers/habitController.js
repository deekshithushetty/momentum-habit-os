import { Habit } from '../models/Habit.js';
import { Completion } from '../models/Completion.js';
import { ApiError } from '../utils/errors.js';
import { invalidateUserCache } from '../services/cacheService.js';
import { listHabits } from '../services/habitService.js';
import { calculateHabitStreaks } from '../utils/streaks.js';
import { toDateKey } from '../utils/date.js';

export async function getHabits(req, res, next) {
  try {
    res.json({ habits: await listHabits(req.user._id, req.query.includeArchived === 'true') });
  } catch (err) {
    next(err);
  }
}

export async function createHabit(req, res, next) {
  try {
    const habit = await Habit.create({ ...req.validated.body, userId: req.user._id });
    await invalidateUserCache(req.user._id);
    res.status(201).json({ habit });
  } catch (err) {
    next(err);
  }
}

export async function updateHabit(req, res, next) {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.validated.body,
      { new: true, runValidators: true }
    );
    if (!habit) throw new ApiError(404, 'Habit not found');
    await invalidateUserCache(req.user._id);
    res.json({ habit });
  } catch (err) {
    next(err);
  }
}

export async function deleteHabit(req, res, next) {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { archivedAt: new Date() },
      { new: true }
    );
    if (!habit) throw new ApiError(404, 'Habit not found');
    await invalidateUserCache(req.user._id);
    res.json({ habit });
  } catch (err) {
    next(err);
  }
}

export async function habitDetail(req, res, next) {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, userId: req.user._id }).lean();
    if (!habit) throw new ApiError(404, 'Habit not found');
    const completions = await Completion.find({ userId: req.user._id, habitId: habit._id }).sort({ dateKey: -1 }).lean();
    const streaks = calculateHabitStreaks(habit, completions.map(c => c.dateKey), toDateKey(new Date(), req.user.preferences.timeZone));
    res.json({ habit, completions, streaks });
  } catch (err) {
    next(err);
  }
}
