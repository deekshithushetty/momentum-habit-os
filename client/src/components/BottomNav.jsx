import { BarChart3, CheckSquare, Home, ListChecks, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  ['/', Home, 'Home'],
  ['/habits', ListChecks, 'Habits'],
  ['/tasks', CheckSquare, 'Tasks'],
  ['/insights', BarChart3, 'Insights'],
  ['/profile', User, 'Profile']
];

export function BottomNav() {
  return <nav className="bottom-nav" aria-label="Primary">
    {items.map(([to, Icon, label]) => (
      <NavLink key={to} to={to} end={to === '/'} className="nav-item">
        <span className="nav-icon"><Icon size={20} /></span>
        <span>{label}</span>
      </NavLink>
    ))}
  </nav>;
}
