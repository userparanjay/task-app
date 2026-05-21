/**
 * task.routes.js — All task endpoints are protected (JWT required)
 */

import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTaskStats,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createTaskSchema, updateTaskSchema } from "../validations/task.validation.js";

const router = Router();

// Every route below needs a valid JWT
router.use(authMiddleware);

router.get("/stats", getTaskStats);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/", validate(createTaskSchema), createTask);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
