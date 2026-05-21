/**
 * server.js — API Gateway entry point
 *
 * Role of a gateway in microservices:
 * - Single URL for the frontend (port 5000)
 * - Routes traffic to the correct microservice
 * - No database — only HTTP forwarding
 *
 * Later with Kubernetes: Ingress does a similar job in production.
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

// Allow React app (port 3000) to call this gateway
app.use(cors());

// Parse JSON body from client
app.use(express.json());

// All auth traffic under /api/auth
app.use("/api/auth", authRoutes);

// All task traffic under /api/tasks
app.use("/api/tasks",()=>{console.log("tasks service is called");}, taskRoutes);

// Simple health check for the gateway itself
app.get("/health", (_req, res) => {
  console.log("health check is called", process.env.TASK_SERVICE_URL);
  res.json({
    status: "ok",
    service: "api-gateway",
    authService: process.env.AUTH_SERVICE_URL,
    taskService: process.env.TASK_SERVICE_URL,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on http://localhost:${PORT}`);
  console.log("health check is called", process.env.TASK_SERVICE_URL);
  console.log(`Forwarding /api/auth/*  → ${process.env.AUTH_SERVICE_URL}`);
  console.log(`Forwarding /api/tasks/* → ${process.env.TASK_SERVICE_URL}`);
});
