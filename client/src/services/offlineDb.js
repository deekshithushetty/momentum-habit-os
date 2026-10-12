import { openDB } from 'idb';

const dbPromise = openDB('momentum-habit-tracker', 1, {
  upgrade(db) {
    db.createObjectStore('snapshots');
    db.createObjectStore('queue', { keyPath: 'operationId' });
  }
});

export async function saveSnapshot(key, value) {
  const db = await dbPromise;
  await db.put('snapshots', { value, savedAt: Date.now() }, key);
}

export async function readSnapshot(key) {
  const db = await dbPromise;
  return (await db.get('snapshots', key))?.value;
}

export async function enqueueOperation(operation) {
  const db = await dbPromise;
  await db.put('queue', { ...operation, queuedAt: Date.now() });
}

export async function getQueuedOperations(userId) {
  const db = await dbPromise;
  const all = await db.getAll('queue');
  return all.filter(op => op.userId === userId);
}

export async function removeOperations(ids) {
  const db = await dbPromise;
  const tx = db.transaction('queue', 'readwrite');
  await Promise.all(ids.map(id => tx.store.delete(id)));
  await tx.done;
}

export async function clearUserLocalData(userId) {
  const db = await dbPromise;
  const ops = await getQueuedOperations(userId);
  await removeOperations(ops.map(op => op.operationId));
}
