import { Outlet } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
import { BottomNav } from '../components/BottomNav.jsx';
import { BrandLogo } from '../components/BrandLogo.jsx';
import { Sidebar } from '../components/Sidebar.jsx';
import { SyncAgent } from '../components/SyncAgent.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';

export function AppLayout() {
  const online = useOnlineStatus();
  const { user } = useAuth();
  return <div className="app-shell">
    <SyncAgent />
    <Sidebar />
    <div className="app-main">
      <header className="mobile-topbar">
        <div className="mobile-brand"><BrandLogo variant="symbol" /><strong>Momentum</strong></div>
        <div className="topbar-actions">
          <button className="top-icon" aria-label="Search"><Search size={18} /></button>
          <button className="top-icon" aria-label="Notifications"><Bell size={18} /></button>
          <span className="avatar">{user?.name?.slice(0, 1) || 'M'}</span>
        </div>
      </header>
      <header className="desktop-topbar">
        <div>
          <p className="eyebrow">Workspace</p>
          <strong>{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</strong>
        </div>
        <div className={`status-pill ${online ? 'online' : 'offline'}`}>{online ? 'Online' : 'Offline changes will sync'}</div>
      </header>
      <Outlet />
      <BottomNav />
    </div>
  </div>;
}
