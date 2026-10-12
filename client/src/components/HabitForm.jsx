import { useEffect, useState } from 'react';

const colors = ['#6366F1', '#22C55E', '#06B6D4', '#F59E0B', '#EF4444', '#EC4899'];
const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const empty = {
  title: '',
  description: '',
  emoji: '✓',
  icon: 'CheckCircle2',
  color: '#6366F1',
  category: 'Personal',
  startDate: new Date().toISOString().slice(0, 10),
  schedule: { type: 'daily', daysOfWeek: [0, 1, 2, 3, 4, 5, 6], targetPerPeriod: 1 },
  reminder: { enabled: false, time: '08:00' },
  paused: false
};

export function HabitForm({ value, onSubmit, onCancel }) {
  const [form, setForm] = useState(empty);
  useEffect(() => setForm(value ? { ...empty, ...value } : empty), [value]);
  const set = patch => setForm(prev => ({ ...prev, ...patch }));
  const toggleDay = day => {
    const next = form.schedule.daysOfWeek.includes(day)
      ? form.schedule.daysOfWeek.filter(d => d !== day)
      : [...form.schedule.daysOfWeek, day].sort();
    set({ schedule: { ...form.schedule, daysOfWeek: next.length ? next : [day] } });
  };
  return <div className="sheet-backdrop" role="presentation">
  <form className="sheet" onSubmit={event => { event.preventDefault(); onSubmit(form); }}>
    <div className="sheet-header"><div><p className="eyebrow">Habit ritual</p><h2>{value ? 'Edit habit' : 'New habit'}</h2></div><button className="ghost icon-only" type="button" onClick={onCancel} aria-label="Close">x</button></div>
    <label>Title<input value={form.title} onChange={e => set({ title: e.target.value })} placeholder="Drink water, read, stretch..." required /></label>
    <label>Description<textarea value={form.description || ''} onChange={e => set({ description: e.target.value })} placeholder="Optional note for future you" /></label>
    <div className="form-grid">
      <label>Emoji<input value={form.emoji} onChange={e => set({ emoji: e.target.value })} maxLength="4" /></label>
      <label>Category<input value={form.category} onChange={e => set({ category: e.target.value })} /></label>
    </div>
    <div><span className="field-title">Color</span><div className="swatches">{colors.map(color => <button type="button" key={color} className={form.color === color ? 'active' : ''} style={{ background: color }} onClick={() => set({ color })} aria-label={`Use ${color}`} />)}</div></div>
    <div><span className="field-title">Schedule</span><div className="weekdays">{weekdays.map((day, index) => <button type="button" key={`${day}-${index}`} className={form.schedule.daysOfWeek.includes(index) ? 'active' : ''} onClick={() => toggleDay(index)}>{day}</button>)}</div></div>
    <label>Start date<input type="date" value={form.startDate} onChange={e => set({ startDate: e.target.value })} /></label>
    <label className="inline"><input type="checkbox" checked={form.reminder?.enabled} onChange={e => set({ reminder: { ...form.reminder, enabled: e.target.checked } })} /> Reminder</label>
    {form.reminder?.enabled && <label>Reminder time<input type="time" value={form.reminder.time || '08:00'} onChange={e => set({ reminder: { ...form.reminder, time: e.target.value } })} /></label>}
    <div className="actions"><button className="secondary" type="button" onClick={onCancel}>Cancel</button><button type="submit">{value ? 'Save changes' : 'Create habit'}</button></div>
  </form>
  </div>;
}
