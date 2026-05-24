import { producer } from "../config/kafka.js";

await producer.connect();

export const taskCreateNotification = async (payload) => {

  await producer.send({
    topic: "task-created",
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log( "task created notification sent to Kafka" );
};