import prisma from "../prisma/prismaClient.js";
import { handleRetry } from "./retry.helper.js";
import { releaseEvent } from "./idempotency.helper.js";

export async function handleTaskCreated(data) {
  try {
    // throw new Error("Simulated create failure");
    await prisma.notification.create({
      data: {
        taskId: data.taskId,
        userId: data.userId,
        message: data.message,
      },
    });

    console.log("✅ Notification created");
  } catch (err) {
    await releaseEvent(data.eventId);

    console.error(
      "❌ Failed processing task create:",
      err.message
    );

    await handleRetry({
      retryTopic: "task-create-retry",
      dlqTopic: "task-create-dlq",
      data,
      error: err,
    });
  }
}

export async function handleTaskUpdate(data) {
  try {
    await prisma.notification.updateMany({
      where: {
        taskId: data.taskId,
      },
      data: {
        message: data.message,
      },
    });

    console.log("✅ Notification updated");
  } catch (err) {
    await releaseEvent(data.eventId);

    console.error(
      "❌ Failed processing task update:",
      err.message
    );

    await handleRetry({
      retryTopic: "task-update-retry",
      dlqTopic: "task-update-dlq",
      data,
      error: err,
    });
  }
}

export async function handleTaskDelete(data) {
  try {
    await prisma.notification.deleteMany({
      where: {
        taskId: data.taskId,
      },
    });

    console.log("✅ Notification deleted");
  } catch (err) {
    await releaseEvent(data.eventId);

    console.error(
      "❌ Failed processing task delete:",
      err.message
    );

    await handleRetry({
      retryTopic: "task-delete-retry",
      dlqTopic: "task-delete-dlq",
      data,
      error: err,
    });
  }
}