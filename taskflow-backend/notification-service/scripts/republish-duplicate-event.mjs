/**
 * Republish a task-created event to test idempotency.
 *
 * Usage (from notification-service):
 *   cp .env.example .env   # ensure KAFKA_BROKER is set
 *   node scripts/republish-duplicate-event.mjs
 *   node scripts/republish-duplicate-event.mjs path/to/payload.json
 */

import "dotenv/config";
import { readFileSync } from "fs";
import { Kafka } from "kafkajs";

const payload = process.argv[2]
  ? JSON.parse(readFileSync(process.argv[2], "utf8"))
  : null;

if (!payload?.eventId) {
  console.error(
    "Pass a JSON file with eventId: node scripts/republish-duplicate-event.mjs payload.json"
  );
  process.exit(1);
}

const kafka = new Kafka({
  clientId: "idempotency-duplicate-test",
  brokers: [process.env.KAFKA_BROKER],
});

const producer = kafka.producer();

await producer.connect();

await producer.send({
  topic: "task-created",
  messages: [
    {
      key: payload.eventId,
      value: JSON.stringify(payload),
    },
  ],
});

console.log("Republished duplicate to task-created");
console.log("eventId:", payload.eventId);

await producer.disconnect();
