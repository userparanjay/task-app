import { producer } from "../config/kafka.js";

export const sendToRetryTopic = async (
  payload,
  retryCount
) => {
  console.log(payload,"retry>>>>>>>>>>>>>>>>>>>>")
  await producer.connect()
  await producer.send({
    topic: "email-retry-topic",
    messages: [
      {
        value: JSON.stringify({
          ...payload,
          retryCount,
        }),
      },
    ],
  });

  console.log(
    `🔁 Sent to retry topic (attempt ${retryCount})`
  );
};

export const sendToDLQ = async (
  payload
) => {
  await producer.connect()
  await producer.send({
    topic: "email-dlq-topic",
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log("☠️ Sent to DLQ");
};