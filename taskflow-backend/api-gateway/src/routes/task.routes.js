/**
 * task.routes.js — Forward /api/tasks/* to task-service
 */

import { Router } from "express";
import { forwardRequest } from "../utils/circuitbreaker/forwardRequest.js";

const router = Router();

const taskBaseUrl = process.env.TASK_SERVICE_URL;

router.use(async (req, res) => {
  const path = `/tasks${req.path === "/" ? "" : req.path}`;
  console.log("tasks service is beng called",path);
  await forwardRequest(req, res, {
    baseUrl: taskBaseUrl,
    method: req.method,
    path,
    serviceName: "Task service",
  });
});

export default router;
