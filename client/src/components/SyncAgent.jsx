import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import { api } from '../services/api.js';
import { getQueuedOperations, removeOperations } from '../services/offlineDb.js';

export function SyncAgent() {
  const online = useOnlineStatus();
  const { user } = useAuth();
  const qc = useQueryClient();
  useEffect(() => {
    if (!online || !user?.id) return;
    let cancelled = false;
    async function sync() {
      const operations = await getQueuedOperations(user.id);
      if (!operations.length || cancelled) return;
      const { data } = await api.post('/completions/sync', { operations });
      const done = data.results?.filter(r => r.ok).map(r => r.operationId) || [];
      await removeOperations(done);
      qc.invalidateQueries();
    }
    sync().catch(() => {});
    return () => { cancelled = true; };
  }, [online, user?.id, qc]);
  return null;
}
