/**
 * notification.validation.js — Zod schemas for notification APIs
 */

import { z } from "zod";

/**
 * Create Notification Schema
 */
export const createNotificationSchema = z.object({
  message: z
    .string({
      required_error: "Message is required",
    })
    .trim()
    .min(1, "Message is required"),

  userId: z.number({
    required_error: "User ID is required",
  }),
});

/**
 * Update Notification Schema (optional for future use)
 */
export const updateNotificationSchema = z
  .object({
    message: z
      .string()
      .trim()
      .min(1, "Message cannot be empty")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });