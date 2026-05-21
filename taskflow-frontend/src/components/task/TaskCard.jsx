import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';

export default function TaskCard({ task }) {
  return (
    <Link
      to={`/tasks/${task.id}`}
      className="block rounded-xl border border-border bg-white p-5 shadow-sm transition hover:border-primary-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-slate-900 line-clamp-1">{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      <p className="mt-2 text-sm text-muted line-clamp-2">{task.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
        <PriorityBadge priority={task.priority} />
        <span>·</span>
        <span>{formatDate(task.createdAt)}</span>
      </div>
    </Link>
  );
}
