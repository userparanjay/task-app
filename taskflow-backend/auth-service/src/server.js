import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDatabase } from "./config/prisma.js";
import authRoutes from "./routes/auth.routes.js";
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
app.use("/", authRoutes);

const PORT = process.env.PORT;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      logger.info("Auth service started", { port: PORT });
    });
  } catch (error) {
    logger.error("Failed to start server", { error: error.message });
    process.exit(1);
  }
}

startServer();
