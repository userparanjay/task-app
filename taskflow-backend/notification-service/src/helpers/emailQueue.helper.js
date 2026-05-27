import { emailQueue } from "../queues/email.queue.js";

export async function queueEmail({
  to,
  subject,
  body,
}) {
  try {
    await emailQueue.add(
      "send-email",
      {
        to,
        subject,
        body,
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 3000,
        },
        removeOnComplete: 100,
        removeOnFail: 50,
      }
    );

    console.log(
      `📩 Email job queued for ${to}`
    );
  } catch (err) {
    console.error(
      "❌ Failed to queue email:",
      err.message
    );

    throw err;
  }
}