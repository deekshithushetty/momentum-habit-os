import { z } from 'zod';

const dateKey = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(120)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

export const habitSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(90),
    description: z.string().max(400).optional().default(''),
    emoji: z.string().max(8).optional(),
    icon: z.string().max(40).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    category: z.string().max(50).optional(),
    schedule: z.object({
      type: z.enum(['daily', 'weekly', 'custom']).default('daily'),
      daysOfWeek: z.array(z.number().min(0).max(6)).min(1).max(7),
      targetPerPeriod: z.number().min(1).max(7).default(1)
    }),
    startDate: dateKey,
    endDate: dateKey.optional().or(z.literal('')),
    reminder: z.object({
      enabled: z.boolean().default(false),
      time: z.string().optional()
    }).optional(),
    paused: z.boolean().optional()
  })
});

export const completionSchema = z.object({
  body: z.object({
    habitId: z.string().min(1),
    dateKey,
    operationId: z.string().max(80).optional(),
    source: z.enum(['online', 'offline-sync']).optional()
  })
});

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(120),
    notes: z.string().max(800).optional().default(''),
    dueDate: dateKey.optional().or(z.literal('')),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    status: z.enum(['open', 'done']).optional(),
    tags: z.array(z.string().max(30)).max(10).optional().default([])
  })
});

export const profileSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80).optional(),
    preferences: z.object({
      theme: z.enum(['dark', 'light', 'system']).optional(),
      timeZone: z.string().min(1).optional(),
      weekStartsOn: z.number().min(0).max(6).optional(),
      notifications: z.object({
        enabled: z.boolean(),
        reminderTime: z.string()
      }).optional()
    }).optional()
  })
});
