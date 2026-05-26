import {producer} from "../config/kafka.js"
export const MAX_RETRY = 3;
export async function sendToRetryTopic(topic,message){
    await producer.send({
      topic:topic,
      message:[{
        key:message.id,
        value:JSON.stringify(message)
      }]
    })
  }
  export const sendToDLQ = async (topic,message, error) => {
    await producer.send({
      topic: topic,
      message: [
        {
          key: message.id,
          value: JSON.stringify({
            ...message,
            error: error.message,
            failedAt: new Date().toISOString(),
          }),
        },
      ],
    });
  
    console.log("Sent to DLQ:", message.id);
  };