import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
  theme: { type: String, enum: ['dark', 'light', 'system'], default: 'dark' },
  timeZone: { type: String, default: 'UTC' },
  weekStartsOn: { type: Number, min: 0, max: 6, default: 1 },
  notifications: {
    enabled: { type: Boolean, default: false },
    reminderTime: { type: String, default: '08:00' }
  },
  installPromptDismissedAt: Date
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  preferences: { type: preferenceSchema, default: () => ({}) }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
