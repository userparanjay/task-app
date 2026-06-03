/**
 * server.js — API Gateway entry point
 */

import "dotenv/config";
import app from "./app.js";
import { registerMetricsRoute } from "./metrics.js";

const PORT = process.env.PORT;

registerMetricsRoute(app);

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log(`Forwarding /api/auth/*  → ${process.env.AUTH_SERVICE_URL}`);
  console.log(`Forwarding /api/tasks/* → ${process.env.TASK_SERVICE_URL}`);
});
