import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 120 },
  notes: { type: String, trim: true, maxlength: 800, default: '' },
  dueDate: String,
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  status: { type: String, enum: ['open', 'done'], default: 'open' },
  tags: { type: [String], default: [] },
  completedAt: Date
}, { timestamps: true });

taskSchema.index({ userId: 1, dueDate: 1, status: 1 });

export const Task = mongoose.model('Task', taskSchema);
