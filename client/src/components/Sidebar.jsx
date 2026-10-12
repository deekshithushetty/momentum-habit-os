import { BarChart3, CheckSquare, Home, ListChecks, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BrandLogo } from './BrandLogo.jsx';

const items = [
  ['/', Home, 'Dashboard'],
  ['/habits', ListChecks, 'Habits'],
  ['/tasks', CheckSquare, 'Tasks'],
  ['/insights', BarChart3, 'Insights'],
  ['/profile', User, 'Profile']
];

export function Sidebar() {
  const { user } = useAuth();
  return <aside className="sidebar">
    <div className="brand"><BrandLogo /><small>Habit OS</small></div>
    <nav>{items.map(([to, Icon, label]) => <NavLink key={to} to={to} end={to === '/'}><Icon size={19} /><span>{label}</span></NavLink>)}</nav>
    <div className="sidebar-account">
      <span>{user?.name?.slice(0, 1) || 'M'}</span>
      <div><strong>{user?.name || 'Momentum'}</strong><small>{user?.email || 'Signed in'}</small></div>
    </div>
  </aside>;
}
