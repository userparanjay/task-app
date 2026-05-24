import { producer } from "../config/kafka.js";

await producer.connect();

export const taskUpdatedNotification = async (payload) => {


  await producer.send({
    topic: "task-updated",
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log( "task updated notification sent to Kafka" );
};