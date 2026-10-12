import { Task } from '../models/Task.js';
import { ApiError } from '../utils/errors.js';

export async function listTasks(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ status: 1, dueDate: 1, createdAt: -1 }).lean();
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const task = await Task.create({ ...req.validated.body, userId: req.user._id });
    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const patch = { ...req.validated.body };
    if (patch.status === 'done') patch.completedAt = new Date();
    if (patch.status === 'open') patch.completedAt = null;
    const task = await Task.findOneAndUpdate({ _id: req.params.id, userId: req.user._id }, patch, { new: true, runValidators: true });
    if (!task) throw new ApiError(404, 'Task not found');
    res.json({ task });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    await Task.deleteOne({ _id: req.params.id, userId: req.user._id });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
}
