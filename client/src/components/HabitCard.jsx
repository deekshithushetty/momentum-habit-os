import { Archive, Check, RotateCcw } from 'lucide-react';

export function HabitCard({ habit, onComplete, onUndo, onEdit, onArchive, pending }) {
  const dayCount = habit.schedule?.daysOfWeek?.length || 7;
  return <article className={`habit-card ${habit.completed ? 'done' : ''}`}>
    <button className="check-button" style={{ '--accent': habit.color }} onClick={() => habit.completed ? onUndo?.(habit) : onComplete?.(habit)} aria-label={habit.completed ? 'Undo completion' : 'Complete habit'}>
      {habit.completed ? <Check size={20} /> : <span>{habit.emoji || '✓'}</span>}
    </button>
    <button className="habit-main" onClick={() => onEdit?.(habit)}>
      <span className="habit-kicker">{habit.category || 'Personal'} {pending ? '· syncing' : ''}</span>
      <strong>{habit.title}</strong>
      <span>{dayCount === 7 ? 'Daily' : `${dayCount} days/week`}{habit.reminder?.enabled ? ` · ${habit.reminder.time || 'Reminder'}` : ''}</span>
    </button>
    <button className="card-icon-action" onClick={() => habit.completed ? onUndo?.(habit) : onArchive?.(habit)} aria-label={habit.completed ? 'Undo habit' : 'Archive habit'}>
      {habit.completed ? <RotateCcw size={18} /> : <Archive size={18} />}
    </button>
  </article>;
}
