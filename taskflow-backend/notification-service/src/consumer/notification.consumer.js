
import { consumer } from "../config/kafka.js";
import { handleTaskCreated ,handleTaskUpdate,handleTaskDelete} from "../helpers/task.helper.js";
export const startNotificationConsumer = async () => {
  try {
    await consumer.connect();

    // Subscribe to all task events
    await consumer.subscribe({
      topics: [
        "task-created",
        "task-updated",
        "task-deleted",
      ],
      fromBeginning: false,
    });

    console.log("✅ Notification consumer connected");

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const data = JSON.parse(message.value.toString());

          console.log(`📩 Event received: ${topic}`, data);

          switch (topic) {
            /**
             * CREATE notification
             */
            case "task-created":
              await handleTaskCreated(data)

              console.log("✅ Notification created");
              break;

            /**
             * UPDATE notification
             */
            case "task-updated":
             await handleTaskUpdate(data)


              console.log("✅ Notification updated");
              break;

            /**
             * DELETE notification
             */
            case "task-deleted":
              await handleTaskDelete(data)
              console.log("✅ Notification deleted");
              break;

            default:
              console.log("Unknown topic:", topic);
          }
        } catch (error) {
          console.error("Kafka processing error:", error);
        }
      },
    });
  } catch (error) {
    console.error("Failed to start notification consumer:", error);
    throw error;
  }
};


