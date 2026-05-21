import { Link } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatDate, formatPriorityLabel, formatStatusLabel } from '../../utils/formatters';

export default function TaskDetailPanel({ task, onDelete, deleting }) {
  return (
    <Card className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{task.title}</h2>
          <p className="mt-1 text-sm text-muted">Created {formatDate(task.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Description</dt>
          <dd className="mt-1 text-sm text-slate-700">{task.description}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Status</dt>
          <dd className="mt-1 text-sm text-slate-700">{formatStatusLabel(task.status)}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">Priority</dt>
          <dd className="mt-1 text-sm text-slate-700">{formatPriorityLabel(task.priority)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3 border-t border-border pt-6">
        <Link to={`/tasks/${task.id}/edit`}>
          <Button variant="primary">Edit Task</Button>
        </Link>
        <Button variant="danger" onClick={onDelete} loading={deleting}>
          Delete Task
        </Button>
        <Link to="/tasks">
          <Button variant="secondary">Back to List</Button>
        </Link>
      </div>
    </Card>
  );
}
