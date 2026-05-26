import { redis } from "../config/redis.js";

const KEY_PREFIX = "email:processed:event:";
const TTL_SECONDS = 7 * 24 * 60 * 60;

/**
 * Atomically claim an event for processing. Returns false if already processed.
 */
export async function claimEvent(eventId) {
  if (!eventId) {
    console.warn("⚠️ Missing eventId — skipping idempotency check");
    return true;
  }

  const result = await redis.set(`${KEY_PREFIX}${eventId}`, "1", {
    NX: true,
    EX: TTL_SECONDS,
  });

  return result === "OK";
}

/**
 * Release a claimed event so retries can be processed again.
 */
export async function releaseEvent(eventId) {
  if (!eventId) {
    return;
  }

  await redis.del(`${KEY_PREFIX}${eventId}`);
}
