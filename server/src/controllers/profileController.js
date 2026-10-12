import { User } from '../models/User.js';
import { Habit } from '../models/Habit.js';
import { Completion } from '../models/Completion.js';
import { Task } from '../models/Task.js';
import { invalidateUserCache } from '../services/cacheService.js';

export async function updateProfile(req, res, next) {
  try {
    const patch = {};
    if (req.validated.body.name) patch.name = req.validated.body.name;
    if (req.validated.body.preferences) patch.preferences = { ...req.user.preferences.toObject(), ...req.validated.body.preferences };
    const user = await User.findByIdAndUpdate(req.user._id, patch, { new: true, runValidators: true }).select('-passwordHash');
    await invalidateUserCache(req.user._id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function exportData(req, res, next) {
  try {
    const [habits, completions, tasks] = await Promise.all([
      Habit.find({ userId: req.user._id }).lean(),
      Completion.find({ userId: req.user._id }).lean(),
      Task.find({ userId: req.user._id }).lean()
    ]);
    res.json({ exportedAt: new Date().toISOString(), user: { name: req.user.name, email: req.user.email, preferences: req.user.preferences }, habits, completions, tasks });
  } catch (err) {
    next(err);
  }
}
