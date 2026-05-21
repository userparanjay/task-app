import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import StatCard from '../../components/common/StatCard';
import { ROUTES } from '../../constants';
import { taskService } from '../../services/taskService';
import { getErrorMessage } from '../../utils/errors';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      setLoading(true);
      setError(null);
      try {
        const data = await taskService.getDashboardStats();
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" label="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
          <p className="text-sm text-muted">Real-time metrics from the task microservice</p>
        </div>
        <Link to={ROUTES.TASK_CREATE}>
          <Button>New Task</Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats?.totalTasks}
          accent="indigo"
          icon={<span className="text-lg">📋</span>}
        />
        <StatCard
          title="Completed"
          value={stats?.completedTasks}
          accent="emerald"
          icon={<span className="text-lg">✅</span>}
        />
        <StatCard
          title="Pending"
          value={stats?.pendingTasks}
          accent="amber"
          icon={<span className="text-lg">⏳</span>}
        />
        <StatCard
          title="Notifications"
          value={stats?.notifications}
          accent="violet"
          icon={<span className="text-lg">🔔</span>}
        />
      </div>

      <div className="rounded-xl border border-dashed border-border bg-white p-6">
        <h3 className="font-semibold text-slate-900">Quick actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to={ROUTES.TASKS}>
            <Button variant="secondary">View all tasks</Button>
          </Link>
          <Link to={ROUTES.NOTIFICATIONS}>
            <Button variant="secondary">View notifications</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
