import prisma from "../prisma/prismaClient.js";
import { consumer } from "../config/kafka.js";

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
              await prisma.notification.create({
                data: {
                  taskId: data.taskId,
                  userId: data.userId,
                  message: data.message,
                },
              });

              console.log("✅ Notification created");
              break;

            /**
             * UPDATE notification
             */
            case "task-updated":
              await prisma.notification.updateMany({
                where: {
                  taskId: data.taskId,
                },
                data: {
                  message: data.message,
                },
              });

              console.log("✅ Notification updated");
              break;

            /**
             * DELETE notification
             */
            case "task-deleted":
              await prisma.notification.deleteMany({
                where: {
                  taskId: data.taskId,
                },
              });

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