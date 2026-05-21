import { useState } from 'react';
import {
  TASK_PRIORITY,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS,
  TASK_STATUS_OPTIONS,
} from '../../constants';
import { validateTask } from '../../utils/validation';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Textarea from '../common/Textarea';

const defaultValues = {
  title: '',
  description: '',
  priority: TASK_PRIORITY.MEDIUM,
  status: TASK_STATUS.TODO,
};

export default function TaskForm({
  initialValues = defaultValues,
  onSubmit,
  submitLabel = 'Save Task',
  loading = false,
  externalErrors = {},
}) {
  const [form, setForm] = useState({
    title: initialValues.title ?? '',
    description: initialValues.description ?? '',
    priority: initialValues.priority ?? TASK_PRIORITY.MEDIUM,
    status: initialValues.status ?? TASK_STATUS.TODO,
  });
  const [errors, setErrors] = useState({});
  const displayErrors = { ...errors, ...externalErrors };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateTask(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    await onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Input
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        error={displayErrors.title}
        placeholder="Enter task title"
      />
      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        error={displayErrors.description}
        placeholder="Describe the task..."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Select
          label="Priority"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          error={displayErrors.priority}
          options={TASK_PRIORITY_OPTIONS}
        />
        <Select
          label="Status"
          name="status"
          value={form.status}
          onChange={handleChange}
          error={displayErrors.status}
          options={TASK_STATUS_OPTIONS}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
