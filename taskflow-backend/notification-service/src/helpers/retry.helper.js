import {
    sendToDLQ,
    sendToRetryTopic,
    MAX_RETRY,
  } from "./kafka.helper.js";
  
  export async function handleRetry({
    retryTopic,
    dlqTopic,
    data,
    error,
  }) {
    const retryCount = data.retryCount || 0;
  
    if (retryCount < MAX_RETRY) {
      await sendToRetryTopic(retryTopic, {
        ...data,
        retryCount: retryCount + 1,
      });
  
      console.log(
        `🔁 Retry ${retryCount + 1}/${MAX_RETRY}`
      );
  
      return;
    }
  
    await sendToDLQ(dlqTopic, data, error);
  
    console.log("💀 Max retries reached. Sent to DLQ");
  }