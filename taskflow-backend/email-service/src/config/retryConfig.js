
export const RETRY_CONFIG = {
    RETRY_TOPIC: "email.retry",
    DLQ_TOPIC: "email.dlq",
    MAX_ATTEMPTS: 2,
    DELAYS_MS: [1_000, 2_000], // attempt 1 → 1s, attempt 2 → 2s
  };
  