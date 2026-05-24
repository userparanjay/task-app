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

    eachMessage: async ({
      topic,
      partition,
      message,
    }) => {
      let data;

      try {
        data = JSON.parse(
          message.value.toString()
        );

        console.log(
          "📩 Email event:",
          topic
        );

        // DLQ consumer
        if (topic === "email-dlq-topic") {
          console.log(
            "☠️ DLQ EVENT:",
            data
          );

          // commit DLQ offset
          await consumer.commitOffsets([
            {
              topic,
              partition,
              offset: (
                Number(message.offset) + 1
              ).toString(),
            },
          ]);

          return;
        }

        await sendEmail({
          to: "pnajan@bestpeers.com",
          subject: `Task Event: ${topic}`,
          text: data.message,
        });

        console.log("✅ Email sent");

        // commit on success
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (
              Number(message.offset) + 1
            ).toString(),
          },
        ]);
      } catch (error) {
        console.error(
          "❌ Email failed:",
          error.message
        );

        const retryCount =
          data?.retryCount || 0;

        if (retryCount < 3) {
          await sendToRetryTopic(
            data,
            retryCount + 1
          );
        } else {
          await sendToDLQ(data);
        }

        // commit failed message
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (
              Number(message.offset) + 1
            ).toString(),
          },
        ]);
      }
    },
  });
};