import prisma from "../prisma/prismaClient.js";
import { sendToDLQ,sendToRetryTopic,MAX_RETRY } from "./kafka.helper.js";

export async function handleTaskCreated (data){

  try{
    await prisma.notification.create({
      data: {
        taskId: data.taskId,
        userId: data.userId,
        message: data.message,
      },
    });
  }catch(err){
    console.error("Failed processing task create:", err.message);
    const retryCount = data.retryCount || 0;
    if(retryCount<MAX_RETRY){
      await sendToRetryTopic("task-create-retry",{
        ...data,
        retryCount: retryCount + 1,
      });
    }else{
      await sendToDLQ( 'task-create-dlq',data, err);
    }
  }
  }
  
  export async function handleTaskUpdate (data){
   
  try{
    await prisma.notification.updateMany({
      where: {
        taskId: data.taskId,
      },
      data: {
        message: data.message,
      },
    });
  }catch(err){
    console.error("Failed processing task update:", err.message);
    const retryCount = data.retryCount || 0;
    if(retryCount<MAX_RETRY){
      await sendToRetryTopic("task-update-retry",{
        ...data,
        retryCount: retryCount + 1,
      });
    }else{
      await sendToDLQ(
        'task-update-dlq',data, err);
    }
  }
  }
  

  export async function handleTaskDelete (data){
    
  try{
    await  prisma.notification.deleteMany({
      where: {
        taskId: data.taskId,
      },
    });
  
  }catch(err){
    console.error("Failed processing: task delete", err.message);
    const retryCount = data.retryCount || 0;
    if(retryCount<MAX_RETRY){
      await sendToRetryTopic("task-delete-retry",{
        ...data,
        retryCount: retryCount + 1,
      });
    }else{
      await sendToDLQ('task-delete-dlq',data, err);
    }
  }
  }
  

