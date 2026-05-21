/**
 * Thin localStorage wrapper — isolates browser storage from business logic.
 * Auth tokens live here until httpOnly cookies are introduced server-side.
 */

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  getString(key) {
    return localStorage.getItem(key);
  },

  setString(key, value) {
    localStorage.setItem(key, value);
  },
};
