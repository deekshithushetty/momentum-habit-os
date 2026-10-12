import { useMutation } from '@tanstack/react-query';
import { Bell, CheckCircle2, Download, LogOut, Moon, Smartphone, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useInstallPrompt } from '../hooks/useInstallPrompt.js';
import { api } from '../services/api.js';

export default function Profile() {
  const { user, logout, setAuth, auth } = useAuth();
  const install = useInstallPrompt();
  const [form, setForm] = useState({ name: user.name, theme: user.preferences?.theme || 'dark', timeZone: user.preferences?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone });
  const [notice, setNotice] = useState('');
  const [notificationState, setNotificationState] = useState('unsupported');
  useEffect(() => {
    if ('Notification' in window) setNotificationState(Notification.permission);
  }, []);
  const save = useMutation({
    mutationFn: () => api.put('/profile', { name: form.name, preferences: { theme: form.theme, timeZone: form.timeZone } }),
    onSuccess: ({ data }) => {
      setAuth({ ...auth, user: { ...data.user, id: data.user.id || data.user._id } });
      setNotice('Preferences saved.');
    }
  });
  const exportData = async () => {
    setNotice('Preparing export...');
    const { data } = await api.get('/profile/export');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `momentum-export-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    URL.revokeObjectURL(url);
    setNotice('Export downloaded.');
  };
  const requestNotifications = async () => {
    if (!('Notification' in window)) return setNotice('This browser does not support notifications.');
    const permission = await Notification.requestPermission();
    setNotificationState(permission);
    setNotice(permission === 'granted' ? 'Notifications enabled.' : 'Notifications were not enabled.');
  };
  return <main className="page">
    <header className="page-header"><div><p className="eyebrow">Account</p><h1>Profile</h1><span className="page-subtitle">Personalize Momentum and manage your data.</span></div></header>
    {notice && <div className="toast" role="status"><CheckCircle2 size={17} />{notice}</div>}
    <section className="profile-hero">
      <span className="profile-avatar">{user.name.slice(0, 1)}</span>
      <div><h2>{user.name}</h2><p>{user.email}</p></div>
    </section>
    <section className="profile-card settings-card">
      <div className="settings-card-title"><UserRound size={18} /><div><h2>Account preferences</h2><span>Name, theme, and time zone</span></div></div>
      <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
      <div className="form-grid">
        <label>Theme<select value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })}><option value="dark">Dark</option><option value="light">Light</option><option value="system">System</option></select></label>
        <label>Time zone<input value={form.timeZone} onChange={e => setForm({ ...form, timeZone: e.target.value })} /></label>
      </div>
      <button onClick={() => save.mutate()}>{save.isPending ? 'Saving...' : 'Save preferences'}</button>
    </section>
    <section className="settings-list">
      <button onClick={exportData}><Download /><span><strong>Export data</strong><small>Download habits, completions, tasks, and preferences</small></span></button>
      <button onClick={install.install} disabled={!install.canInstall || install.standalone}><Smartphone /><span><strong>{install.standalone ? 'Installed' : install.canInstall ? 'Install Momentum' : 'Install from Chrome menu'}</strong><small>{install.standalone ? 'Momentum is running as an app.' : install.canInstall ? 'Add the app to your Android home screen.' : 'Use Add to Home screen if the prompt is unavailable.'}</small></span></button>
      <button onClick={requestNotifications}><Bell /><span><strong>Notifications</strong><small>Status: {notificationState}</small></span></button>
      <button><Moon /><span><strong>Appearance</strong><small>Premium dark mode is active by default</small></span></button>
      <button className="danger" onClick={logout}><LogOut /><span><strong>Log out</strong><small>Clear this session and local queued actions</small></span></button>
    </section>
    <div className="empty"><Smartphone size={22} />On Android Chrome, use the install button when available, or choose Add to Home screen from the browser menu. Installation requires HTTPS outside localhost.</div>
  </main>;
}
