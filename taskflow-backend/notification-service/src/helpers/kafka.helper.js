import "dotenv/config";
import { producer } from "../config/kafka.js";

export const MAX_RETRY = Number(process.env.KAFKA_MAX_RETRY);

export async function sendToRetryTopic(topic, message) {
  await producer.send({
    topic,
    messages: [
      {
        key: message.eventId ?? String(message.taskId),
        value: JSON.stringify(message),
      },
    ],
  });

  console.log(`🔁 Sent to retry topic: ${topic}`);
}

export async function sendToDLQ(topic, message, error) {
  await producer.send({
    topic,
    messages: [
      {
        key: message.eventId ?? String(message.taskId),
        value: JSON.stringify({
          ...message,
          error: error.message,
          failedAt: new Date().toISOString(),
        }),
      },
    ],
  });

  console.log(`💀 Sent to DLQ: ${topic}`);
}