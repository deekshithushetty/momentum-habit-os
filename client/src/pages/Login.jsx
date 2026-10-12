import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const submit = async event => {
    event.preventDefault();
    setLoading(true); setError('');
    try { await login(form); navigate('/'); } catch (err) { setError(err.response?.data?.error?.message || 'Login failed'); } finally { setLoading(false); }
  };
  return <form onSubmit={submit} className="auth-form">
    <div><p className="eyebrow">Sign in</p><h1>Welcome back</h1><span className="page-subtitle">Pick up today’s rhythm right where you left it.</span></div>
    <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
    <label>Password<div className="password-row"><input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff /> : <Eye />}</button></div></label>
    {error && <p className="error">{error}</p>}
    <button className="full-action" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
    <p className="muted">New here? <Link to="/auth/register">Create an account</Link></p>
  </form>;
}
