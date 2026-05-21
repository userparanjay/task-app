import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';
import TaskForm from '../../components/task/TaskForm';
import { taskService } from '../../services/taskService';
import { getErrorMessage, getValidationErrors } from '../../utils/errors';

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      const data = await taskService.createTask(formData);
      navigate(`/tasks/${data.task.id}`);
    } catch (err) {
      setFieldErrors(getValidationErrors(err) || {});
      setError(getErrorMessage(err, 'Failed to create task'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Create Task</h2>
        <p className="text-sm text-muted">POST /api/tasks (via gateway)</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      <Card>
        <TaskForm
          onSubmit={handleSubmit}
          submitLabel="Create Task"
          loading={loading}
          externalErrors={fieldErrors}
        />
      </Card>
    </div>
  );
}
