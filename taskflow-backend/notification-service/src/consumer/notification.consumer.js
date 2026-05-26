import { consumer ,producer} from "../config/kafka.js";

import {
  handleTaskCreated,
  handleTaskUpdate,
  handleTaskDelete,
} from "../helpers/task.helper.js";
import { claimEvent } from "../helpers/idempotency.helper.js";

export const startNotificationConsumer = async () => {
  try {
    await consumer.connect();
    await producer.connect()
    await consumer.subscribe({
      topics: [
        "task-created",
        "task-updated",
        "task-deleted",

        // retry topics
        "task-create-retry",
        "task-update-retry",
        "task-delete-retry",
      ],
      fromBeginning: false,
    });

    console.log(
      "✅ Notification consumer connected"
    );

    await consumer.run({
      eachMessage: async ({
        topic,
        message,
      }) => {
        try {
          const data = JSON.parse(
            message.value.toString()
          );

          console.log(
            `📩 Event received: ${topic}`,
            data
          );

          const claimed = await claimEvent(data.eventId);
          if (!claimed) {
            console.log(
              `⏭️ Duplicate event skipped: ${data.eventId}`
            );
            return;
          }

          switch (topic) {
            case "task-created":
            case "task-create-retry":
              await handleTaskCreated(data);
              break;

            case "task-updated":
            case "task-update-retry":
              await handleTaskUpdate(data);
              break;

            case "task-deleted":
            case "task-delete-retry":
              await handleTaskDelete(data);
              break;

            default:
              console.log(
                "Unknown topic:",
                topic
              );
          }
        } catch (error) {
          console.error(
            "Kafka processing error:",
            error.message
          );
        }
      },
    });
  } catch (error) {
    console.error(
      "Failed to start notification consumer:",
      error
    );

    throw error;
  }
};