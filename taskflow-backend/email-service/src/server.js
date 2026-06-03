import "dotenv/config";
import "./workers/email.worker.js";
import express from "express";
import { validateKafkaEnv, validateRedisEnv } from "./config/env.js";
import { startEmailConsumer } from "./consumer/email.consumer.js";
import { connectRedis } from "./config/redis.js";
import { registerMetricsMiddleware, registerMetricsRoute } from "./metrics.js";

const app = express();

app.use(express.json());
registerMetricsMiddleware(app);
registerMetricsRoute(app);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "email-service" });
});

async function startServer() {
  validateKafkaEnv();
  validateRedisEnv();
  await connectRedis();
  // await startEmailConsumer();

  app.listen(process.env.PORT, () => {
    console.log(
      `Email service running on http://localhost:${process.env.PORT}`
    );
  });
}

startServer().catch((error) => {
  console.error("Failed to start email-service:", error.message);
  process.exit(1);
});