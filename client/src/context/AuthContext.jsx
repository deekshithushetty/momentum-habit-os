import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthToken } from '../services/api.js';
import { clearUserLocalData } from '../services/offlineDb.js';

const AuthContext = createContext(null);
const stored = JSON.parse(localStorage.getItem('momentum-auth') || 'null');
setAuthToken(stored?.token);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(stored);

  useEffect(() => {
    const root = document.documentElement;
    const preference = auth?.user?.preferences?.theme || 'dark';
    const applyTheme = () => {
      const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const resolved = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
      root.dataset.theme = resolved;
      root.style.colorScheme = resolved;
    };
    applyTheme();
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (preference === 'system') media?.addEventListener('change', applyTheme);
    return () => media?.removeEventListener('change', applyTheme);
  }, [auth?.user?.preferences?.theme]);

  useEffect(() => {
    const expire = () => logout();
    window.addEventListener('session-expired', expire);
    return () => window.removeEventListener('session-expired', expire);
  }, []);

  const commit = next => {
    setAuth(next);
    setAuthToken(next?.token);
    if (next) localStorage.setItem('momentum-auth', JSON.stringify(next));
    else localStorage.removeItem('momentum-auth');
  };

  const login = async credentials => {
    const { data } = await api.post('/auth/login', credentials);
    commit(data);
  };

  const register = async payload => {
    const { data } = await api.post('/auth/register', payload);
    commit(data);
  };

  const logout = async () => {
    if (auth?.user?.id) await clearUserLocalData(auth.user.id);
    commit(null);
  };

  const value = useMemo(() => ({ auth, user: auth?.user, token: auth?.token, login, register, logout, setAuth: commit }), [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
