/**
 * auth.validator.js — Request validation with Zod
 *
 * Schemas describe what a valid signup/login body looks like.
 * Routes run these through validate.middleware.js before controllers.
 */

import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .trim()
    .min(1, "Name is required"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Enter a valid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Enter a valid email"),
  password: z.string({ required_error: "Password is required" }).min(1, "Password is required"),
});
