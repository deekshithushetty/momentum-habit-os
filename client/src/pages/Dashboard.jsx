import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarDays, Flame, Plus, Target, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { HabitCard } from '../components/HabitCard.jsx';
import { ProgressRing } from '../components/ProgressRing.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { api } from '../services/api.js';
import { enqueueOperation, readSnapshot, saveSnapshot } from '../services/offlineDb.js';

const todayKey = () => new Date().toISOString().slice(0, 10);

export default function Dashboard() {
  const { user } = useAuth();
  const online = useOnlineStatus();
  const qc = useQueryClient();
  const query = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/dashboard');
        await saveSnapshot(`dashboard:${user.id}`, data.dashboard);
        return data.dashboard;
      } catch (err) {
        const cached = await readSnapshot(`dashboard:${user.id}`);
        if (cached) return { ...cached, cached: true };
        throw err;
      }
    }
  });
  const complete = useMutation({
    mutationFn: async ({ habit, undo }) => {
      const payload = { habitId: habit._id, dateKey: todayKey(), operationId: crypto.randomUUID(), type: undo ? 'undo' : 'complete' };
      if (!online) {
        await enqueueOperation({ ...payload, userId: user.id });
        return { queued: true };
      }
      return undo ? api.delete('/completions', { data: payload }) : api.post('/completions', payload);
    },
    onMutate: async ({ habit, undo }) => {
      await qc.cancelQueries({ queryKey: ['dashboard'] });
      const previous = qc.getQueryData(['dashboard']);
      qc.setQueryData(['dashboard'], old => {
        if (!old) return old;
        const todayHabits = old.todayHabits.map(item => item._id === habit._id ? { ...item, completed: !undo } : item);
        const completed = todayHabits.filter(item => item.completed).length;
        const scheduled = todayHabits.length;
        return { ...old, todayHabits, totals: { ...old.totals, completed, remaining: scheduled - completed, rate: scheduled ? Math.round((completed / scheduled) * 100) : 0 } };
      });
      return { previous };
    },
    onError: (_error, _vars, context) => context?.previous && qc.setQueryData(['dashboard'], context.previous),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['dashboard'] })
  });
  const dashboard = query.data;
  const weekly = dashboard?.weekly || [];
  return <main className="page">
    <header className="page-header dashboard-header">
      <div><p className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p><h1>Hi, {user.name.split(' ')[0]}</h1><span className="page-subtitle">Your rituals, today.</span></div>
      <Link className="icon-action label-action" to="/habits"><Plus size={18} /><span>Add</span></Link>
    </header>
    {query.isLoading ? <div className="skeleton hero-skeleton" /> : <section className="hero-panel">
      <div className="hero-copy"><p className="eyebrow">{dashboard?.cached ? 'Cached progress' : 'Daily progress'}</p><h2>{dashboard?.totals.completed || 0} of {dashboard?.totals.scheduled || 0} complete</h2><p>{dashboard?.motivational}</p><div className="progress-track"><span style={{ width: `${dashboard?.totals.rate || 0}%` }} /></div></div>
      <ProgressRing value={dashboard?.totals.rate || 0} />
    </section>}
    <section className="metric-grid">
      <article><Flame size={18} /><strong>{dashboard?.currentStreak || 0}</strong><span>Current streak</span></article>
      <article><TrendingUp size={18} /><strong>{dashboard?.longestStreak || 0}</strong><span>Longest streak</span></article>
      <article><Target size={18} /><strong>{dashboard?.totals.remaining || 0}</strong><span>Remaining</span></article>
    </section>
    <div className="dashboard-grid">
      <section className="stack today-panel">
        <div className="section-title"><div><h2>Today</h2><span>{dashboard?.totals.scheduled || 0} scheduled habits</span></div><Link to="/habits">Manage</Link></div>
        {dashboard?.todayHabits?.length ? dashboard.todayHabits.map(habit => <HabitCard key={habit._id} habit={habit} pending={!online} onComplete={habit => complete.mutate({ habit })} onUndo={habit => complete.mutate({ habit, undo: true })} />) : <div className="empty"><CalendarDays size={22} />No habits scheduled today. Add one to start the loop.</div>}
      </section>
      <section className="chart-panel weekly-panel">
        <div className="section-title"><div><h2>Weekly rhythm</h2><span>Completion rate by day</span></div></div>
        <div className="mini-week">{weekly.map(day => <div key={day.dateKey}><span style={{ height: `${Math.max(6, day.rate)}%` }} /><small>{new Date(`${day.dateKey}T00:00:00Z`).toLocaleDateString(undefined, { weekday: 'narrow' })}</small></div>)}</div>
        <ResponsiveContainer width="100%" height={126}><LineChart data={weekly}><XAxis dataKey="dateKey" hide /><Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(148,163,184,.16)', borderRadius: 12 }} /><Line type="monotone" dataKey="rate" stroke="#34D399" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer>
      </section>
    </div>
  </main>;
}
