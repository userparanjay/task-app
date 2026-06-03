/**
 * server.js — Task Service entry point (port 5004)
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./prisma/prismaClient.js";
import { connectProducer } from "./config/kafka.js";
import taskRoutes from "./routes/task.routes.js";
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
  res.json({ status: "ok", service: "task-service" });
});

app.use("/tasks", taskRoutes);

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDatabase();
    await connectProducer();

    app.listen(PORT, () => {
      logger.info("Task service started", { port: PORT });
    });
  } catch (error) {
    logger.error("Failed to start task-service", { error: error.message });
    process.exit(1);
  }
}

startServer();
