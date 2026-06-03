/**
 * app.js — Express app (no listen) — used by server.js and tests
 */

import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import { getCircuitBreakerStates } from "./utils/circuitBreaker.js";
import { isCircuitBreakerEnabled } from "./utils/circuitBreakerConfig.js";
import { registerMetricsMiddleware } from "./metrics.js";

const app = express();

app.use(cors());
app.use(express.json());
registerMetricsMiddleware(app);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "api-gateway",
    authService: process.env.AUTH_SERVICE_URL,
    taskService: process.env.TASK_SERVICE_URL,
    circuitBreaker: {
      enabled: isCircuitBreakerEnabled(),
      services: getCircuitBreakerStates(),
    },
  });
});

export default app;
