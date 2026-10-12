export function completionRate(completed, scheduled) {
  return scheduled ? Math.round((completed / scheduled) * 100) : 0;
}
