/**
 * Shared Axios instance for all microservice calls.
 * - baseURL from VITE_API_BASE_URL (Kubernetes ingress / API gateway)
 * - Request interceptor attaches JWT
 * - Response interceptor handles 401 globally
 *
 * Domain services (auth, tasks, notifications) import this — never raw axios.
 */

import axios from 'axios';
import { STORAGE_KEYS } from '../constants';
import { storage } from '../utils/storage';

const baseURL = import.meta.env.VITE_API_BASE_URL;
console.log("API URL:", import.meta.env.VITE_API_BASE_URL);

export const apiClient = axios.create({
  baseURL,
  timeout: Number(import.meta.env.VITE_HTTP_TIMEOUT_MS),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);

      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?session=expired';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
