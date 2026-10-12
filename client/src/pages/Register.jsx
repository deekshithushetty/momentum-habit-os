import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const submit = async event => {
    event.preventDefault();
    if (form.password.length < 8) return setError('Use at least 8 characters.');
    setLoading(true); setError('');
    try { await register(form); navigate('/'); } catch (err) { setError(err.response?.data?.error?.message || 'Registration failed'); } finally { setLoading(false); }
  };
  return <form onSubmit={submit} className="auth-form">
    <div><p className="eyebrow">Start Momentum</p><h1>Create account</h1><span className="page-subtitle">A private habit system built around your routines.</span></div>
    <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
    <label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></label>
    <label>Password<div className="password-row"><input type={show ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff /> : <Eye />}</button></div></label>
    {error && <p className="error">{error}</p>}
    <button className="full-action" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
    <p className="muted">Already have an account? <Link to="/auth/login">Sign in</Link></p>
  </form>;
}
