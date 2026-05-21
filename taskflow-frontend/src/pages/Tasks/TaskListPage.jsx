import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Spinner from '../../components/common/Spinner';
import TaskCard from '../../components/task/TaskCard';
import TaskFilters from '../../components/task/TaskFilters';
import { ROUTES } from '../../constants';
import { useDebounce } from '../../hooks/useDebounce';
import { taskService } from '../../services/taskService';
import { getErrorMessage } from '../../utils/errors';

const initialFilters = { search: '', status: '', priority: '' };

export default function TaskListPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(filters.search, 350);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: debouncedSearch || undefined,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
      };
      const data = await taskService.getTasks(params);
      setTasks(data.tasks || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.status, filters.priority]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">All Tasks</h2>
          <p className="text-sm text-muted">Search and filter tasks from the API</p>
        </div>
        <Link to={ROUTES.TASK_CREATE}>
          <Button>Create Task</Button>
        </Link>
      </div>

      <TaskFilters filters={filters} onChange={setFilters} />

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading tasks..." />
        </div>
      ) : tasks.length === 0 ? (
        <EmptyState
          icon="📭"
          title="No tasks found"
          description="Try adjusting your filters or create a new task."
          action={
            <Link to={ROUTES.TASK_CREATE}>
              <Button>Create Task</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
