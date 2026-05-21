
import prisma from "../prisma/prismaClient.js";
import { consumer } from "../config/kafka.js";


export const startNotificationConsumer = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "task-created",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const data = JSON.parse(message.value.toString());

        console.log("📩 Kafka Event Received:", data);

        await prisma.notification.create({
          data: {
            message: data.message,
            userId: data.userId,
          },
        });

      } catch (err) {
        console.error("Kafka processing error:", err);
      }
    },
  });
};