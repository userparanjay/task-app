export function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env and set it.`
    );
  }
  return value;
}

export function validateKafkaEnv() {
  requireEnv("KAFKA_BROKER");
  requireEnv("KAFKA_CLIENT_ID");
  requireEnv("KAFKA_CONSUMER_GROUP_ID");
}

export function validateRedisEnv() {
  requireEnv("REDIS_URL");
  requireEnv("REDIS_IDEMPOTENCY_KEY_PREFIX");
  requireEnv("REDIS_IDEMPOTENCY_TTL_SECONDS");
}
