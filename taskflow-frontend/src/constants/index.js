/**
 * Centralized constants — aligned with task-service Zod enums
 */

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'taskflow_access_token',
  REFRESH_TOKEN: 'taskflow_refresh_token',
  USER: 'taskflow_user',
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  TASKS: '/tasks',
  TASK_CREATE: '/tasks/new',
  TASK_DETAIL: '/tasks/:id',
  TASK_EDIT: '/tasks/:id/edit',
  NOTIFICATIONS: '/notifications',
};

// Match task-service Prisma enums
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const TASK_STATUS_OPTIONS = [
  { value: TASK_STATUS.TODO, label: 'Todo' },
  { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
  { value: TASK_STATUS.COMPLETED, label: 'Completed' },
];

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

export const TASK_PRIORITY_OPTIONS = [
  { value: TASK_PRIORITY.LOW, label: 'Low' },
  { value: TASK_PRIORITY.MEDIUM, label: 'Medium' },
  { value: TASK_PRIORITY.HIGH, label: 'High' },
];

export const NOTIFICATION_TYPES = {
  TASK_CREATED: 'TASK_CREATED',
  TASK_UPDATED: 'TASK_UPDATED',
  TASK_COMPLETED: 'TASK_COMPLETED',
  TASK_ASSIGNED: 'TASK_ASSIGNED',
};
