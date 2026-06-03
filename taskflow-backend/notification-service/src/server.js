/**
 * server.js — Notification Service entry point (port 5005)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";

import { validateKafkaEnv, validateRedisEnv } from "./config/env.js";
import { connectDatabase } from "./prisma/prismaClient.js";
import { connectRedis } from "./config/redis.js";

import notificationRoutes from "./routes/notification.routes.js";
import { startNotificationConsumer } from "./consumer/notification.consumer.js";
import { registerRequestLogger, logger } from "./utils/logger/logger.js";
import {
  registerMetricsMiddleware,
  registerMetricsRoute,
} from "./utils/metrics/metrics.js";

const app = express();

app.use(cors());
app.use(express.json());
registerMetricsMiddleware(app);
registerRequestLogger(app);
registerMetricsRoute(app);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "notification-service",
  });
});

app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT;

async function startServer() {
  try {
    validateKafkaEnv();
    validateRedisEnv();

    await connectDatabase();
    await connectRedis();
    await startNotificationConsumer();

    app.listen(PORT, () => {
      logger.info("Notification service started", { port: PORT });
    });
  } catch (error) {
    logger.error("Failed to start notification-service", {
      error: error.message,
    });
    process.exit(1);
  }
}

startServer();
