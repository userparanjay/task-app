import { producer } from "../config/kafka.js";

await producer.connect();

export const taskDeleteNotification = async (payload) => {


  await producer.send({
    topic: "task-deleted",
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log( "task deleted notification sent to Kafka" );
};