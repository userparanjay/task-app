/**
 * Auth API client — talks to API Gateway (not auth-service directly).
 *
 * Gateway: http://localhost:5000/api/auth/*
 */

import axios from 'axios';
import { STORAGE_KEYS } from '../constants';
import { storage } from '../utils/storage';

const baseURL =
  import.meta.env.VITE_AUTH_API_URL;

export const authApiClient = axios.create({
  baseURL,
  timeout: Number(import.meta.env.VITE_HTTP_TIMEOUT_MS),
  headers: {
    'Content-Type': 'application/json',
  },
});

authApiClient.interceptors.request.use((config) => {
  const token = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

authApiClient.interceptors.response.use(
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

export default authApiClient;
