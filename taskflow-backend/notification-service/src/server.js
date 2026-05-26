/**
 * server.js — Notification Service entry point (port 5005)
 *
 * Microservice responsibilities:
 * - Own PostgreSQL database (notification_db)
 * - Save notifications
 * - Verify JWT for protected APIs
 *
 * Does NOT:
 * - Store user passwords
 * - Access auth database
 * - Use Kafka (yet)
 *
 * Later:
 * Task Service → HTTP call → Notification Service
 * Then:
 * Task Service → Kafka → Notification Service
 */

import "dotenv/config";
import express from "express";
import cors from "cors";

import { connectDatabase } from "./prisma/prismaClient.js";
import { connectRedis } from "./config/redis.js";

import notificationRoutes from "./routes/notification.routes.js";
import { startNotificationConsumer } from "./consumer/notification.consumer.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

/**
 * Health check
 * Used to verify service is running
 */
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "notification-service",
  });
});

/**
 * Notification routes
 *
 * Example:
 * POST /notifications
 * GET /notifications
 */
app.use("/notifications", notificationRoutes);

const PORT = process.env.PORT;

/**
 * Start server only after DB connection
 */
async function startServer() {
  try {
    // Connect Prisma/Postgres
    await connectDatabase();
    await connectRedis();

    await startNotificationConsumer();

  
    app.listen(PORT, () => {
      console.log(
        `Notification service running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start notification-service:",
      error.message
    );

    process.exit(1);
  }
}

startServer();