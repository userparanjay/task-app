const statusStyles = {
  TODO: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const priorityStyles = {
  LOW: 'bg-slate-100 text-slate-600',
  MEDIUM: 'bg-amber-100 text-amber-700',
  HIGH: 'bg-red-100 text-red-700',
};

export function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status] || statusStyles.TODO}`}
    >
      {formatStatusBadge(status)}
    </span>
  );
}

export function PriorityBadge({ priority }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityStyles[priority] || priorityStyles.LOW}`}
    >
      {formatPriorityBadge(priority)}
    </span>
  );
}

function formatStatusBadge(status) {
  return status?.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || '—';
}

function formatPriorityBadge(priority) {
  return priority ? priority.charAt(0) + priority.slice(1).toLowerCase() : '—';
}

export function TypeBadge({ type }) {
  return (
    <span className="inline-flex rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">
      {type?.replace(/_/g, ' ')}
    </span>
  );
}
