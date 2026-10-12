import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 90 },
  description: { type: String, trim: true, maxlength: 400, default: '' },
  icon: { type: String, default: 'CheckCircle2' },
  emoji: { type: String, default: '✓' },
  color: { type: String, default: '#6366F1' },
  category: { type: String, default: 'Personal', trim: true, maxlength: 50 },
  schedule: {
    type: { type: String, enum: ['daily', 'weekly', 'custom'], default: 'daily' },
    daysOfWeek: { type: [Number], default: [0, 1, 2, 3, 4, 5, 6] },
    targetPerPeriod: { type: Number, min: 1, max: 7, default: 1 }
  },
  startDate: { type: String, required: true },
  endDate: String,
  reminder: {
    enabled: { type: Boolean, default: false },
    time: String
  },
  paused: { type: Boolean, default: false },
  archivedAt: Date
}, { timestamps: true });

habitSchema.index({ userId: 1, archivedAt: 1, paused: 1 });

export const Habit = mongoose.model('Habit', habitSchema);
