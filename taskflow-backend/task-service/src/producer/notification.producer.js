import { producer } from "./kafka.js";

await producer.connect();

export const createNotification = async (req, res) => {
  const order = req.body;

  await producer.send({
    topic: "task-created",
    messages: [
      {
        value: JSON.stringify(order),
      },
    ],
  });

  console.log( "task sent to Kafka" );
};