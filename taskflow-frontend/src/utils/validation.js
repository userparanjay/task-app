/**
 * Lightweight form validators — matches task-service Zod rules
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'COMPLETED'];
const TASK_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'];

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateSignup({ name, email, password, confirmPassword }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'Name is required';
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateTask({ title, description, priority, status }) {
  const errors = {};
  if (!title?.trim()) errors.title = 'Title is required';
  if (!description?.trim()) errors.description = 'Description is required';
  if (!priority || !TASK_PRIORITIES.includes(priority)) errors.priority = 'Priority is required';
  if (!status || !TASK_STATUSES.includes(status)) errors.status = 'Status is required';
  return { valid: Object.keys(errors).length === 0, errors };
}
