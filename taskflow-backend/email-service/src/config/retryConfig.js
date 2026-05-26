import "dotenv/config";

export const RETRY_CONFIG = {
  RETRY_TOPIC: process.env.KAFKA_EMAIL_RETRY_TOPIC,
  DLQ_TOPIC: process.env.KAFKA_EMAIL_DLQ_TOPIC,
  MAX_ATTEMPTS: Number(process.env.KAFKA_EMAIL_MAX_RETRY_ATTEMPTS),
  DELAYS_MS: process.env.KAFKA_EMAIL_RETRY_DELAYS_MS.split(",").map(Number),
};
