/**
 * Normalizes Axios and API errors for the UI.
 */

export function getErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  const data = error.response?.data;

  if (data?.message) {
    return data.message;
  }

  if (data?.error) {
    return data.error;
  }

  if (error.message === 'Network Error') {
    return 'Unable to reach the auth server. Is it running on port 5003?';
  }

  if (error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Zod validation errors from auth-service: { errors: { email: ["..."] } }
 */
export function getValidationErrors(error) {
  const apiErrors = error.response?.data?.errors;
  if (!apiErrors || typeof apiErrors !== 'object') {
    return null;
  }

  const fieldErrors = {};
  for (const [field, messages] of Object.entries(apiErrors)) {
    fieldErrors[field] = Array.isArray(messages) ? messages[0] : messages;
  }

  return fieldErrors;
}
