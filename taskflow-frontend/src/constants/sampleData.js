/**
 * Seed data for UI development when backend is unavailable.
 * Services fall back to these responses on network errors in dev only.
 * Remove or gate behind VITE_USE_SAMPLE_DATA when microservices are live.
 */

export const SAMPLE_TASKS = [
  {
    id: 'tsk_001',
    title: 'Design API gateway routes',
    description: 'Define ingress paths for auth, tasks, and notification services.',
    assignedTo: 'alex@taskflow.io',
    priority: 'high',
    status: 'in-progress',
    createdAt: '2026-05-18T10:00:00Z',
  },
  {
    id: 'tsk_002',
    title: 'Configure Kafka consumers',
    description: 'Wire task-created events to the notification microservice.',
    assignedTo: 'sam@taskflow.io',
    priority: 'medium',
    status: 'todo',
    createdAt: '2026-05-19T14:30:00Z',
  },
  {
    id: 'tsk_003',
    title: 'Redis session cache POC',
    description: 'Evaluate Redis for JWT session invalidation lists.',
    assignedTo: 'alex@taskflow.io',
    priority: 'low',
    status: 'completed',
    createdAt: '2026-05-15T09:15:00Z',
  },
  {
    id: 'tsk_004',
    title: 'PostgreSQL migration scripts',
    description: 'Versioned migrations for tasks and users schemas.',
    assignedTo: 'jordan@taskflow.io',
    priority: 'high',
    status: 'todo',
    createdAt: '2026-05-20T08:45:00Z',
  },
];

export const SAMPLE_NOTIFICATIONS = [
  {
    id: 'ntf_001',
    type: 'TASK_CREATED',
    message: 'Task "Design API gateway routes" was created.',
    timestamp: '2026-05-21T09:00:00Z',
  },
  {
    id: 'ntf_002',
    type: 'TASK_ASSIGNED',
    message: 'Task assigned successfully to alex@taskflow.io',
    timestamp: '2026-05-21T08:30:00Z',
  },
  {
    id: 'ntf_003',
    type: 'TASK_COMPLETED',
    message: 'Task "Redis session cache POC" marked as completed.',
    timestamp: '2026-05-20T16:00:00Z',
  },
];

export const SAMPLE_DASHBOARD_STATS = {
  totalTasks: 4,
  completedTasks: 1,
  pendingTasks: 3,
  notifications: 3,
};

export const SAMPLE_USER = {
  id: 'usr_demo',
  name: 'Demo User',
  email: 'demo@taskflow.io',
};
