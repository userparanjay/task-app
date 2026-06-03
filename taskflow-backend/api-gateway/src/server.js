/**
 * server.js — API Gateway entry point
 */

import "dotenv/config";
import app from "./app.js";
import { logger } from "./utils/logger/logger.js";
import { registerMetricsRoute } from "./utils/metrics/metrics.js";

const PORT = process.env.PORT;

registerMetricsRoute(app);

app.listen(PORT, () => {
  logger.info("API Gateway started", {
    port: PORT,
    authService: process.env.AUTH_SERVICE_URL,
    taskService: process.env.TASK_SERVICE_URL,
  });
});
