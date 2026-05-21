/**
 * Task client — API Gateway → task-service
 *
 *   GET/POST    /api/tasks
 *   GET         /api/tasks/stats
 *   GET/PUT/DEL /api/tasks/:id
 *
 * Requires JWT (attached by apiClient interceptor).
 */

import apiClient from './apiClient';

const ENDPOINTS = {
  TASKS: '/tasks',
  TASK_BY_ID: (id) => `/tasks/${id}`,
  STATS: '/tasks/stats',
};

function toTaskPayload({ title, description, status, priority }) {
  return { title, description, status, priority };
}

function assertSuccess(data, fallback) {
  if (data?.success === false) {
    throw new Error(data.message || fallback);
  }
}

export const taskService = {
  async getTasks(params = {}) {
    const { data } = await apiClient.get(ENDPOINTS.TASKS, { params });
    assertSuccess(data, 'Failed to fetch tasks');
    return { tasks: data.tasks || [] };
  },

  async getTaskById(id) {
    const { data } = await apiClient.get(ENDPOINTS.TASK_BY_ID(id));
    assertSuccess(data, 'Failed to fetch task');
    return { task: data.task || null };
  },

  async createTask(formData) {
    const { data } = await apiClient.post(ENDPOINTS.TASKS, toTaskPayload(formData));
    assertSuccess(data, 'Failed to create task');
    return { task: data.task };
  },

  async updateTask(id, formData) {
    const { data } = await apiClient.put(
      ENDPOINTS.TASK_BY_ID(id),
      toTaskPayload(formData),
    );
    assertSuccess(data, 'Failed to update task');
    return { task: data.task };
  },

  async deleteTask(id) {
    const { data } = await apiClient.delete(ENDPOINTS.TASK_BY_ID(id));
    assertSuccess(data, 'Failed to delete task');
    return data;
  },

  async getDashboardStats() {
    const { data } = await apiClient.get(ENDPOINTS.STATS);
    assertSuccess(data, 'Failed to fetch stats');
    return {
      totalTasks: data.totalTasks ?? 0,
      completedTasks: data.completedTasks ?? 0,
      pendingTasks: data.pendingTasks ?? 0,
      notifications: 0, // notification-service not connected yet
    };
  },
};

export default taskService;
