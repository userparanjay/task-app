export function formatDate(isoString) {
  if (!isoString) return '—';
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(isoString));
}

export function formatStatusLabel(status) {
  const map = {
    TODO: 'Todo',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
  };
  return map[status] || status?.replace(/_/g, ' ') || '—';
}

export function formatPriorityLabel(priority) {
  const map = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  };
  return map[priority] || priority || '—';
}
