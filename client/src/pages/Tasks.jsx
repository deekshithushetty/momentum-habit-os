import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Check, Edit3, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '../services/api.js';

export default function Tasks() {
  const [form, setForm] = useState({ title: '', dueDate: '', priority: 'medium', notes: '' });
  const [editing, setEditing] = useState(null);
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ['tasks'], queryFn: async () => (await api.get('/tasks')).data.tasks });
  const create = useMutation({ mutationFn: payload => api.post('/tasks', payload), onSuccess: () => { setForm({ title: '', dueDate: '', priority: 'medium', notes: '' }); qc.invalidateQueries({ queryKey: ['tasks'] }); } });
  const update = useMutation({ mutationFn: task => api.put(`/tasks/${task._id}`, task), onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }) });
  const remove = useMutation({ mutationFn: id => api.delete(`/tasks/${id}`), onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }) });
  const draft = editing || form;
  const setDraft = patch => editing ? setEditing({ ...editing, ...patch }) : setForm({ ...form, ...patch });
  const submit = e => {
    e.preventDefault();
    if (editing) update.mutate(editing, { onSuccess: () => setEditing(null) });
    else create.mutate(form);
  };
  return <main className="page">
    <header className="page-header"><div><p className="eyebrow">Planning</p><h1>Tasks</h1><span className="page-subtitle">Small actions that support your habits.</span></div></header>
    <form className="task-form" onSubmit={submit}>
      <input placeholder="Plan a task" value={draft.title} onChange={e => setDraft({ title: e.target.value })} required />
      <input type="date" value={draft.dueDate || ''} onChange={e => setDraft({ dueDate: e.target.value })} />
      <select value={draft.priority} onChange={e => setDraft({ priority: e.target.value })}><option>low</option><option>medium</option><option>high</option></select>
      <button>{editing ? 'Save' : <><Plus size={17} />Add</>}</button>
      {editing && <button className="secondary" type="button" onClick={() => setEditing(null)}><X size={17} />Cancel</button>}
    </form>
    <section className="stack">{data.map(task => <article key={task._id} className={`task-card ${task.status}`}>
      <button onClick={() => update.mutate({ ...task, status: task.status === 'done' ? 'open' : 'done' })}><Check size={18} /></button>
      <div><strong>{task.title}</strong><span>{task.dueDate || 'No due date'} · {task.priority}</span></div>
      <button className="ghost" onClick={() => setEditing(task)}><Edit3 size={18} /></button>
      <button className="ghost" onClick={() => remove.mutate(task._id)}><Trash2 size={18} /></button>
    </article>)}</section>
  </main>;
}
