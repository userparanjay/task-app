/**
 * Auth state via Context API — Redux-ready shape.
 * Exposes user, token, loading, and auth actions for the whole tree.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEYS } from '../constants';
import { authService } from '../services/authService';
import { storage } from '../utils/storage';
import { getErrorMessage } from '../utils/errors';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.USER));
  const [token, setToken] = useState(() => storage.getString(STORAGE_KEYS.ACCESS_TOKEN));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const persistSession = useCallback(({ user: nextUser, accessToken, refreshToken }) => {
    storage.set(STORAGE_KEYS.USER, nextUser);
    storage.setString(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) storage.setString(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    setUser(nextUser);
    setToken(accessToken);
  }, []);

  const clearSession = useCallback(() => {
    storage.remove(STORAGE_KEYS.USER);
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
    setUser(null);
    setToken(null);
  }, []);

  const bootstrapAuth = useCallback(async () => {
    const storedToken = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getCurrentUser();
      if (data?.user) {
        setUser(data.user);
        setToken(storedToken);
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    } finally {
      setLoading(false);
    }
  }, [clearSession]);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = useCallback(
    async (credentials) => {
      setError(null);
      const data = await authService.login(credentials);
      persistSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return data.user;
    },
    [persistSession],
  );

  const signup = useCallback(
    async (payload) => {
      setError(null);
      const data = await authService.signup(payload);
      persistSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return data.user;
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    await authService.logout();
    clearSession();
  }, [clearSession]);

  const handleAuthError = useCallback((err) => {
    const message = getErrorMessage(err, 'Authentication failed');
    setError(message);
    throw err;
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      loading,
      error,
      setError,
      login,
      signup,
      logout,
      handleAuthError,
    }),
    [user, token, loading, error, login, signup, logout, handleAuthError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
