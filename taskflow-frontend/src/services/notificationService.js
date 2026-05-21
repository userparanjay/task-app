/**
 * Notification microservice — fed by Kafka consumers on the backend.
 * GET /api/notifications returns event-sourced messages for the UI.
 */

import apiClient from './apiClient';
import { SAMPLE_NOTIFICATIONS } from '../constants/sampleData';

const ENDPOINTS = {
  NOTIFICATIONS: '/notifications',
  MARK_READ: (id) => `/notifications/${id}/read`,
};

const useSampleFallback = import.meta.env.DEV;

async function withSampleFallback(requestFn, sampleData) {
  try {
    const { data } = await requestFn();
    return data;
  } catch (error) {
    if (useSampleFallback && (error.code === 'ERR_NETWORK' || !error.response)) {
      return sampleData;
    }
    throw error;
  }
}

export const notificationService = {
  async getNotifications() {
    return withSampleFallback(
      () => apiClient.get(ENDPOINTS.NOTIFICATIONS),
      { notifications: SAMPLE_NOTIFICATIONS },
    );
  },

  async markAsRead(id) {
    return withSampleFallback(
      () => apiClient.patch(ENDPOINTS.MARK_READ(id)),
      { success: true },
    );
  },
};

export default notificationService;
