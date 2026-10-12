import { Outlet } from 'react-router-dom';
import { BrandLogo } from '../components/BrandLogo.jsx';

export function AuthLayout() {
  return <main className="auth-screen">
    <section className="auth-card">
      <div className="brand auth-brand"><BrandLogo /><small>Build the day deliberately</small></div>
      <Outlet />
    </section>
  </main>;
}
