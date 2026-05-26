import { consumer, producer } from "../config/kafka.js";
import { sendEmail } from "../services/email.service.js";
import { publishToRetryOrDLQ } from "../services/retry.service.js";
import { RETRY_CONFIG } from "../config/retryConfig.js";
import { parseMessageMetadata } from "../utils/parseMessageMetadata.js";
import {
  claimEvent,
  releaseEvent,
} from "../helpers/idempotency.helper.js";

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

      const commitOffset = async () => {
        await consumer.commitOffsets([
          {
            topic,
            partition,
            offset: (
              Number(message.offset) + 1
            ).toString(),
          },
        ]);
      };

      const claimed = await claimEvent(data.eventId);
      if (!claimed) {
        console.log(
          `⏭️ Duplicate email event skipped: ${data.eventId}`
        );
        await commitOffset();
        return;
      }

      try {
        console.log(
          isRetry
            ? `🔁 Retry attempt ${attempt}`
            : "📩 Processing email"
        );

        await sendEmail({
          to: process.env.EMAIL_TO,
          subject: `Task Event: ${originalTopic}`,
          text: data.message,
        });

        await commitOffset();

        console.log(
          "✅ Email processed"
        );
      } catch (error) {
        await releaseEvent(data.eventId);

        console.error(
          "❌ Email failed",
          error.message
        );

        await publishToRetryOrDLQ({
          topic: originalTopic,
          message,
          error,
        });

        await commitOffset();
      }
    },
  });
};