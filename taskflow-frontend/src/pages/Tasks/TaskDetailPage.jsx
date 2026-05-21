import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import TaskDetailPanel from '../../components/task/TaskDetailPanel';
import { taskService } from '../../services/taskService';
import { getErrorMessage } from '../../utils/errors';

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTask() {
      setLoading(true);
      setError(null);
      try {
        const data = await taskService.getTaskById(id);
        if (!cancelled) setTask(data.task);
      } catch (err) {
        if (!cancelled) setError(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTask();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Delete this task permanently?')) return;
    setDeleting(true);
    try {
      await taskService.deleteTask(id);
      navigate('/tasks');
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete task'));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner label="Loading task details..." />
      </div>
    );
  }

  if (!task) {
    return <EmptyState title="Task not found" description="This task does not exist." />;
  }

  return (
    <div className="space-y-4">
      {error && <Alert variant="error">{error}</Alert>}
      <TaskDetailPanel task={task} onDelete={handleDelete} deleting={deleting} />
    </div>
  );
}
