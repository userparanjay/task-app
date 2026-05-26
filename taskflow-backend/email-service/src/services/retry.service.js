

import { producer } from "../config/kafka.js";
import { RETRY_CONFIG } from "../config/retryConfig.js";

export const publishToRetryOrDLQ = async ({
  topic,
  message,
  error,
}) => {
  const headers = message.headers ?? {};

  const currentAttempt = parseInt(
    headers["x-retry-attempt"]?.toString() ?? "0"
  );

  const nextAttempt = currentAttempt + 1;

  const isExhausted =
    currentAttempt >= RETRY_CONFIG.MAX_ATTEMPTS;

  const destination = isExhausted
    ? RETRY_CONFIG.DLQ_TOPIC
    : RETRY_CONFIG.RETRY_TOPIC;

  const delayMs =
    RETRY_CONFIG.DELAYS_MS[currentAttempt] ?? 0;

  await producer.send({
    topic: destination,

    messages: [
      {
        key: message.key,
        value: message.value,

        headers: {
          ...headers,

          "x-original-topic":
            headers["x-original-topic"]?.toString() ??
            topic,

          "x-retry-attempt":
            String(nextAttempt),

          "x-last-error":
            error.message,

          "x-last-failed-at":
            new Date().toISOString(),

          "x-first-failed-at":
            headers["x-first-failed-at"]?.toString() ??
            new Date().toISOString(),

          "x-next-retry-at":
            new Date(
              Date.now() + delayMs
            ).toISOString(),

          "x-delay-ms":
            String(delayMs),
        },
      },
    ],
  });

  console.warn(
    isExhausted
      ? "💀 Sent to DLQ"
      : `🔁 Sent to retry (${nextAttempt}/${RETRY_CONFIG.MAX_ATTEMPTS})`
  );
};

export const sendToRetryTopic = async (
  payload,
  retryCount
) => {
 
  await producer.send({
    topic: "email-retry-topic",
    messages: [
      {
        value: JSON.stringify({
          ...payload,
          retryCount,
        }),
      },
    ],
  });

  console.log(
    `🔁 Sent to retry topic (attempt ${retryCount})`
  );
};

export const sendToDLQ = async (
  payload
) => {

  await producer.send({
    topic: "email-dlq-topic",
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log("☠️ Sent to DLQ");
};