import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Filter, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { HabitCard } from '../components/HabitCard.jsx';
import { HabitForm } from '../components/HabitForm.jsx';
import { api } from '../services/api.js';

export default function Habits() {
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ['habits'], queryFn: async () => (await api.get('/habits')).data.habits });
  const save = useMutation({
    mutationFn: habit => habit._id ? api.put(`/habits/${habit._id}`, habit) : api.post('/habits', habit),
    onSuccess: () => { setEditing(null); qc.invalidateQueries({ queryKey: ['habits'] }); qc.invalidateQueries({ queryKey: ['dashboard'] }); }
  });
  const archive = useMutation({
    mutationFn: habit => api.delete(`/habits/${habit._id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['habits'] })
  });
  const visibleHabits = (data || []).filter(habit => `${habit.title} ${habit.category}`.toLowerCase().includes(search.toLowerCase()));
  return <main className="page">
    <header className="page-header"><div><p className="eyebrow">Systems</p><h1>Habits</h1><span className="page-subtitle">Design the routine once. Repeat with less friction.</span></div><button className="icon-action label-action" onClick={() => setEditing({})}><Plus size={18} /><span>Add</span></button></header>
    <section className="toolbar-panel">
      <label className="search-field"><Search size={18} /><input placeholder="Search habits" aria-label="Search habits" value={search} onChange={event => setSearch(event.target.value)} /></label>
      <button className="secondary compact-action"><Filter size={17} /> Active</button>
    </section>
    {editing && <HabitForm value={editing._id ? editing : null} onSubmit={save.mutate} onCancel={() => setEditing(null)} />}
    <section className="stack habit-list">
      {isLoading && <div className="skeleton hero-skeleton" />}
      {visibleHabits.map(habit => <HabitCard key={habit._id} habit={habit} onEdit={setEditing} onArchive={archive.mutate} />)}
      {!isLoading && !visibleHabits.length && <div className="empty">Create your first habit with a schedule, color, reminder, and emoji.</div>}
    </section>
  </main>;
}
