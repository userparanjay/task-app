import "dotenv/config";
import { requireEnv } from "./env.js";

export const RETRY_CONFIG = {
  RETRY_TOPIC: requireEnv("KAFKA_EMAIL_RETRY_TOPIC"),
  DLQ_TOPIC: requireEnv("KAFKA_EMAIL_DLQ_TOPIC"),
  MAX_ATTEMPTS: Number(requireEnv("KAFKA_EMAIL_MAX_RETRY_ATTEMPTS")),
  DELAYS_MS: requireEnv("KAFKA_EMAIL_RETRY_DELAYS_MS")
    .split(",")
    .map(Number),
};
