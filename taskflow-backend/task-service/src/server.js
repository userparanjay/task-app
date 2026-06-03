/**
 * server.js — Task Service entry point (port 5004)
 *
 * Microservice responsibilities:
 * - Own PostgreSQL database (task_db)
 * - Verify JWT (shared secret with auth-service)
 * - CRUD tasks for logged-in user only
 *
 * Does NOT: store user passwords, call auth DB, use Kafka (yet)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./prisma/prismaClient.js";
import { connectProducer } from "./config/kafka.js";
import taskRoutes from "./routes/task.routes.js";
import { registerMetricsMiddleware, registerMetricsRoute } from "./metrics.js";

const app = express();

app.use(cors());
app.use(express.json());
registerMetricsMiddleware(app);
registerMetricsRoute(app);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "task-service" });
});

app.use("/tasks",taskRoutes);

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDatabase();
    await connectProducer();

    app.listen(PORT, () => {
      console.log(`Task service running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start task-service:", error.message);
    console.error("Check DATABASE_URL and that PostgreSQL is running");
    process.exit(1);
  }
}

startServer();
