import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from '../../constants';
import Input from '../common/Input';
import Select from '../common/Select';

const statusOptions = [{ value: '', label: 'All statuses' }, ...TASK_STATUS_OPTIONS];
const priorityOptions = [{ value: '', label: 'All priorities' }, ...TASK_PRIORITY_OPTIONS];

export default function TaskFilters({ filters, onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...filters, [name]: value });
  };

  return (
    <div className="grid gap-4 rounded-xl border border-border bg-white p-4 sm:grid-cols-3">
      <Input
        label="Search"
        name="search"
        value={filters.search}
        onChange={handleChange}
        placeholder="Search by title or description..."
      />
      <Select
        label="Status"
        name="status"
        value={filters.status}
        onChange={handleChange}
        options={statusOptions}
      />
      <Select
        label="Priority"
        name="priority"
        value={filters.priority}
        onChange={handleChange}
        options={priorityOptions}
      />
    </div>
  );
}
