import mongoose from 'mongoose';
import { Habit } from '../models/Habit.js';
import { Completion } from '../models/Completion.js';
import { ApiError } from '../utils/errors.js';
import { invalidateUserCache } from '../services/cacheService.js';

export async function completeHabit(req, res, next) {
  try {
    const { habitId, dateKey, operationId, source = 'online' } = req.validated.body;
    const habit = await Habit.findOne({ _id: habitId, userId: req.user._id, archivedAt: null });
    if (!habit) throw new ApiError(404, 'Habit not found');
    const completion = await Completion.findOneAndUpdate(
      { userId: req.user._id, habitId, dateKey },
      { $setOnInsert: { source, operationId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    await invalidateUserCache(req.user._id);
    res.status(201).json({ completion });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) return next(new ApiError(400, 'Validation failed'));
    next(err);
  }
}

export async function undoHabit(req, res, next) {
  try {
    const { habitId, dateKey } = req.validated.body;
    await Completion.deleteOne({ userId: req.user._id, habitId, dateKey });
    await invalidateUserCache(req.user._id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}

export async function syncQueue(req, res, next) {
  try {
    const operations = Array.isArray(req.body.operations) ? req.body.operations : [];
    const results = [];
    for (const op of operations) {
      req.validated = { body: op };
      if (op.type === 'undo') {
        await Completion.deleteOne({ userId: req.user._id, habitId: op.habitId, dateKey: op.dateKey });
      } else {
        const habit = await Habit.findOne({ _id: op.habitId, userId: req.user._id, archivedAt: null });
        if (habit) {
          await Completion.findOneAndUpdate(
            { userId: req.user._id, habitId: op.habitId, dateKey: op.dateKey },
            { $setOnInsert: { source: 'offline-sync', operationId: op.operationId } },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
        }
      }
      results.push({ operationId: op.operationId, ok: true });
    }
    await invalidateUserCache(req.user._id);
    res.json({ results });
  } catch (err) {
    next(err);
  }
}
