import "dotenv/config";
import "./workers/email.worker.js";
import express from "express";
import { validateKafkaEnv, validateRedisEnv } from "./config/env.js";
import { connectRedis } from "./config/redis.js";
import { registerRequestLogger, logger } from "./utils/logger/logger.js";
import {
  registerMetricsMiddleware,
  registerMetricsRoute,
} from "./utils/metrics/metrics.js";

const app = express();

app.use(express.json());
registerMetricsMiddleware(app);
registerRequestLogger(app);
registerMetricsRoute(app);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "email-service" });
});

async function startServer() {
  validateKafkaEnv();
  validateRedisEnv();
  await connectRedis();

  app.listen(process.env.PORT, () => {
    logger.info("Email service started", { port: process.env.PORT });
  });
}

startServer().catch((error) => {
  logger.error("Failed to start email-service", { error: error.message });
  process.exit(1);
});
