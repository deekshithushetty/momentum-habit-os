import mongoose from 'mongoose';

const completionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true, index: true },
  dateKey: { type: String, required: true, index: true },
  source: { type: String, enum: ['online', 'offline-sync'], default: 'online' },
  operationId: { type: String, index: true }
}, { timestamps: true });

completionSchema.index({ userId: 1, habitId: 1, dateKey: 1 }, { unique: true });
completionSchema.index({ userId: 1, dateKey: 1 });

export const Completion = mongoose.model('Completion', completionSchema);
