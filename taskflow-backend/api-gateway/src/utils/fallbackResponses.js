/**
 * Degraded responses returned when a circuit is open (service unavailable).
 */

const FALLBACK_BY_SERVICE = {
  "Auth service": {
    success: false,
    message:
      "Auth service is temporarily unavailable. Please try again in a few moments.",
    degraded: true,
  },
  "Task service": {
    success: false,
    message:
      "Task service is temporarily unavailable. Please try again in a few moments.",
    degraded: true,
    tasks: [],
  },
  "Notification service": {
    success: false,
    message:
      "Notification service is temporarily unavailable. Please try again in a few moments.",
    degraded: true,
  },
};

const DEFAULT_FALLBACK = {
  success: false,
  message: "Service is temporarily unavailable. Please try again in a few moments.",
  degraded: true,
};

export function getFallbackResponse(serviceName = "Service") {
  return FALLBACK_BY_SERVICE[serviceName] ?? {
    ...DEFAULT_FALLBACK,
    message: `${serviceName} is temporarily unavailable. Please try again in a few moments.`,
  };
}
