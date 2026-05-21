import { useEffect, useState } from 'react';
import Alert from '../../components/common/Alert';
import { TypeBadge } from '../../components/common/Badge';
import Card from '../../components/common/Card';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import { notificationService } from '../../services/notificationService';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../utils/errors';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await notificationService.getNotifications();
        if (!cancelled) setNotifications(data.notifications || []);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Notifications</h2>
        <p className="text-sm text-muted">
          Events from Kafka — TASK_CREATED, TASK_ASSIGNED, TASK_COMPLETED
        </p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading notifications..." />
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon="🔕"
          title="No notifications"
          description="Backend events will appear here when the notification service is connected."
        />
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => (
            <li key={notification.id}>
              <Card className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <TypeBadge type={notification.type} />
                  <p className="text-sm font-medium text-slate-800">{notification.message}</p>
                </div>
                <time className="shrink-0 text-xs text-muted">
                  {formatDate(notification.timestamp)}
                </time>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
