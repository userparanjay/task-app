/**
 * Circuit breaker settings (env-driven with sensible defaults).
 */

export function getCircuitBreakerOptions() {
  return {
    timeout: Number(process.env.HTTP_TIMEOUT_MS) || 15_000,
    errorThresholdPercentage:
      Number(process.env.CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENT) || 50,
    resetTimeout: Number(process.env.CIRCUIT_BREAKER_RESET_TIMEOUT_MS) || 30_000,
    volumeThreshold: Number(process.env.CIRCUIT_BREAKER_VOLUME_THRESHOLD) || 5,
    rollingCountTimeout:
      Number(process.env.CIRCUIT_BREAKER_ROLLING_WINDOW_MS) || 10_000,
    rollingCountBuckets:
      Number(process.env.CIRCUIT_BREAKER_ROLLING_BUCKETS) || 10,
  };
}

export function isCircuitBreakerEnabled() {
  return process.env.CIRCUIT_BREAKER_ENABLED !== "false";
}
