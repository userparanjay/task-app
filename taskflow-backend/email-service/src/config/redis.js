import { createClient } from "redis";

const REDIS_URL =
  process.env.REDIS_URL || "redis://localhost:6380";

export const redis = createClient({ url: REDIS_URL });

redis.on("error", (err) => {
  console.error("Redis error:", err.message);
});

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
    console.log("✅ Redis connected (email-service)");
  }
}
