import { useQuery } from '@tanstack/react-query';
import { Activity, Award, CalendarRange } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../services/api.js';

function monthStart() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`; }
function today() { return new Date().toISOString().slice(0, 10); }

export default function Insights() {
  const [range, setRange] = useState({ start: monthStart(), end: today() });
  const { data } = useQuery({ queryKey: ['insights', range], queryFn: async () => (await api.get('/insights', { params: range })).data.insights });
  const average = data?.daily?.length ? Math.round(data.daily.reduce((sum, day) => sum + day.rate, 0) / data.daily.length) : 0;
  const best = data?.weekday?.reduce((top, day) => day.rate > (top?.rate || 0) ? day : top, null);
  return <main className="page">
    <header className="page-header"><div><p className="eyebrow">Analytics</p><h1>Insights</h1><span className="page-subtitle">Understand the patterns behind your consistency.</span></div></header>
    <section className="range-row"><label><CalendarRange size={17} />From<input type="date" value={range.start} onChange={e => setRange({ ...range, start: e.target.value })} /></label><label>To<input type="date" value={range.end} onChange={e => setRange({ ...range, end: e.target.value })} /></label></section>
    <section className="metric-grid insights-metrics">
      <article><Activity size={18} /><strong>{average}%</strong><span>Average completion</span></article>
      <article><Award size={18} /><strong>{best ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][best.day] : '-'}</strong><span>Best day</span></article>
      <article><CalendarRange size={18} /><strong>{data?.daily?.length || 0}</strong><span>Tracked days</span></article>
    </section>
    <div className="analytics-grid">
      <section className="chart-panel"><div className="section-title"><div><h2>Completion trend</h2><span>Daily rate across the selected range</span></div></div><ResponsiveContainer width="100%" height={230}><LineChart data={data?.daily || []}><CartesianGrid stroke="rgba(148,163,184,.12)" /><XAxis dataKey="dateKey" hide /><YAxis width={32} /><Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(148,163,184,.16)', borderRadius: 12 }} /><Line dataKey="rate" stroke="#818CF8" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></section>
      <section className="chart-panel"><div className="section-title"><div><h2>Weekday breakdown</h2><span>Best-performing days</span></div></div><ResponsiveContainer width="100%" height={230}><BarChart data={data?.weekday || []}><CartesianGrid stroke="rgba(148,163,184,.12)" /><XAxis dataKey="day" tickFormatter={d => ['S','M','T','W','T','F','S'][d]} /><YAxis width={32} /><Tooltip contentStyle={{ background: '#111827', border: '1px solid rgba(148,163,184,.16)', borderRadius: 12 }} /><Bar dataKey="rate" fill="#34D399" radius={[8,8,0,0]} /></BarChart></ResponsiveContainer></section>
    </div>
    <section className="stack"><div className="section-title"><div><h2>Habit performance</h2><span>Comparison by completion rate and current streak</span></div></div>{data?.habitPerformance?.map(item => <article className="performance-card" key={item.habitId}><div><strong>{item.title}</strong><span>{item.completed}/{item.scheduled} completions · {item.current} current streak · {item.longest} best</span></div><b>{item.rate}%</b></article>)}</section>
  </main>;
}
