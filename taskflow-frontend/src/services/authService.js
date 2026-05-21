/**
 * Auth client — via API Gateway at /api/auth/*
 *
 *   POST /api/auth/signup
 *   POST /api/auth/login
 *   GET  /api/auth/profile
 */

import authApiClient from './authApiClient';

const ENDPOINTS = {
  SIGNUP: '/signup',
  LOGIN: '/login',
  PROFILE: '/profile',
};

function normalizeSession(data) {
  return {
    user: data.user,
    accessToken: data.token,
    refreshToken: null,
  };
}

export const authService = {
  async login(credentials) {
    const { data } = await authApiClient.post(ENDPOINTS.LOGIN, credentials);

    if (!data.success || !data.token) {
      throw new Error(data.message || 'Login failed');
    }

    return normalizeSession(data);
  },

  async signup(payload) {
    const { data } = await authApiClient.post(ENDPOINTS.SIGNUP, payload);

    if (!data.success) {
      throw new Error(data.message || 'Signup failed');
    }

    return this.login({ email: payload.email, password: payload.password });
  },

  async getCurrentUser() {
    const { data } = await authApiClient.get(ENDPOINTS.PROFILE);

    if (!data.success || !data.user) {
      throw new Error(data.message || 'Failed to load profile');
    }

    return { user: data.user };
  },

  async logout() {},
};

export default authService;
