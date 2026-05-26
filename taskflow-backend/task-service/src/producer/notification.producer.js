import { producer } from "../config/kafka.js";

await producer.connect();

export const taskProducer = async (topic,payload) => {

  await producer.send({
    topic: topic,
    messages: [
      {
        key: payload.eventId,
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log( "task created notification sent to Kafka" );
};