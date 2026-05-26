import { consumer, producer } from "../config/kafka.js";
import { sendEmail } from "../services/email.service.js";
import { publishToRetryOrDLQ } from "../services/retry.service.js";
import { RETRY_CONFIG } from "../config/retryConfig.js";
import { parseMessageMetadata } from "../utils/parseMessageMetadata.js";

export const startEmailConsumer = async () => {
  await producer.connect();
  await consumer.connect();

  await consumer.subscribe({
    topics: [
      "task-created",
      "task-updated",
      "task-deleted",
      RETRY_CONFIG.RETRY_TOPIC
    ],
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
      const {
        isRetry,
        originalTopic,
        attempt,
        headers,
      } = parseMessageMetadata(
        topic,
        message
      );

      // delayed retry
      if (isRetry) {
        const retryAt =
          headers["x-next-retry-at"]?.toString();

        if (retryAt) {
          const waitMs =
            new Date(retryAt).getTime() -
            Date.now();

          if (waitMs > 0) {
            console.log(
              `⏳ Waiting ${waitMs}ms`
            );

            await new Promise((resolve) =>
              setTimeout(resolve, waitMs)
            );
          }
        }
      }

      let data;

      try {
        data = JSON.parse(
          message.value.toString()
        );
      } catch (error) {
        await publishToRetryOrDLQ({
          topic: originalTopic,
          message,
          error,
        });

        return;
      }

      try {
        console.log(
          isRetry
            ? `🔁 Retry attempt ${attempt}`
            : "📩 Processing email"
        );

        // simulate failure
        // throw new Error(
        //   "Simulated email failure"
        // );

        await sendEmail({
          to: "pnajan@bestpeers.com",
          subject: `Task Event: ${originalTopic}`,
          text: data.message,
        });

        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (
              Number(message.offset) + 1
            ).toString(),
          },
        ]);

        console.log(
          "✅ Email processed"
        );
      } catch (error) {
        console.error(
          "❌ Email failed",
          error.message
        );

        await publishToRetryOrDLQ({
          topic: originalTopic,
          message,
          error,
        });

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