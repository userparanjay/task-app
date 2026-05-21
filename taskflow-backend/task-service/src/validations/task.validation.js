/**
 * task.validation.js — Zod schemas for task APIs
 */

import { z } from "zod";

const statusEnum = z.enum(["TODO", "IN_PROGRESS", "COMPLETED"]);
const priorityEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);

export const createTaskSchema = z.object({
  title: z.string({ required_error: "Title is required" }).trim().min(1, "Title is required"),
  description: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(1, "Description is required"),
  status: statusEnum,
  priority: priorityEnum,
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "Title cannot be empty").optional(),
    description: z.string().trim().min(1, "Description cannot be empty").optional(),
    status: statusEnum.optional(),
    priority: priorityEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });
