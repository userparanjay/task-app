import { producer, connectProducer } from "../config/kafka.js";

export const taskProducer = async (topic, payload) => {
  await connectProducer();

  await producer.send({
    topic: topic,
    messages: [
      {
        key: payload.eventId,
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log("task created notification sent to Kafka");
};
