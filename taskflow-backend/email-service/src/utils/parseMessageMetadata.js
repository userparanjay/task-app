import { RETRY_CONFIG } from "../config/retryConfig.js";

export function parseMessageMetadata(
  topic,
  message
) {
  const headers = message.headers ?? {};

  const isRetry =
    topic === RETRY_CONFIG.RETRY_TOPIC;

  const originalTopic =
    headers["x-original-topic"]?.toString() ??
    topic;

  const attempt = parseInt(
    headers["x-retry-attempt"]?.toString() ??
      "0"
  );

  return {
    isRetry,
    originalTopic,
    attempt,
    headers,
  };
}