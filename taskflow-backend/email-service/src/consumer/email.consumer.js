import { consumer } from "../config/kafka.js";
import { sendEmail } from "../services/email.service.js";
import {
  sendToRetryTopic,
  sendToDLQ,
} from "../services/retry.service.js";

export const startEmailConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "task-created",
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: "task-updated",
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: "task-deleted",
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: "email-retry-topic",
    fromBeginning: false,
  });

  await consumer.subscribe({
    topic: "email-dlq-topic",
    fromBeginning: false,
  });

  console.log("✅ Email consumer connected");

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      const data = JSON.parse(message.value.toString());
    
      try {
        switch (topic) {
    
          // =========================
          // 1. BUSINESS TOPICS
          // =========================
          case "task-created":
          case "task-updated":
          case "task-deleted": {
            await sendEmail({
              to: "pnajan@bestpeers.com",
              subject: `Task Event: ${topic}`,
              text: data.message,
            });
    
            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);
    
            break;
          }
    
          // =========================
          // 2. RETRY TOPIC
          // =========================
          case "email-retry-topic": {
            const retryCount = data.retryCount || 0;
    
            try {
              await sendEmail({
                to: "pnajan@bestpeers.com",
                subject: `Retry Email`,
                text: data.message,
              });
    
              await consumer.commitOffsets([
                {
                  topic,
                  partition,
                  offset: (Number(message.offset) + 1).toString(),
                },
              ]);
            } catch (err) {
              if (retryCount < 3) {
                await sendToRetryTopic(data, retryCount + 1);
              } else {
                await sendToDLQ(data);
              }
    
              await consumer.commitOffsets([
                {
                  topic,
                  partition,
                  offset: (Number(message.offset) + 1).toString(),
                },
              ]);
            }
    
            break;
          }
    
          // =========================
          // 3. DLQ TOPIC
          // =========================
          case "email-dlq-topic": {
            console.log("☠️ FINAL FAILED MESSAGE:", data);
    
            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);
    
            break;
          }
    
          default: {
            console.log("⚠️ Unknown topic:", topic);
    
            await consumer.commitOffsets([
              {
                topic,
                partition,
                offset: (Number(message.offset) + 1).toString(),
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    }
  });
};