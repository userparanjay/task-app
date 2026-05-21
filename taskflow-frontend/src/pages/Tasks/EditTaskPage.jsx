import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import EmptyState from '../../components/common/EmptyState';
import TaskForm from '../../components/task/TaskForm';
import { taskService } from '../../services/taskService';
import { getErrorMessage, getValidationErrors } from '../../utils/errors';

export default function EditTaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function loadTask() {
      setLoading(true);
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

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError(null);
    setFieldErrors({});
    try {
      await taskService.updateTask(id, formData);
      navigate(`/tasks/${id}`);
    } catch (err) {
      setFieldErrors(getValidationErrors(err) || {});
      setError(getErrorMessage(err, 'Failed to update task'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner label="Loading task..." />
      </div>
    );
  }

  if (!task) {
    return (
      <EmptyState
        title="Task not found"
        description="The task may have been deleted or the ID is invalid."
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Edit Task</h2>
        <p className="text-sm text-muted">PUT /api/tasks/{id}</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <Card>
        <TaskForm
          initialValues={task}
          onSubmit={handleSubmit}
          submitLabel="Update Task"
          loading={saving}
          externalErrors={fieldErrors}
        />
      </Card>
    </div>
  );
}
