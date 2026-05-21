/**
 * notification.routes.js
 *
 * All notification endpoints are protected (JWT required)
 */

import { Router } from "express";

import {
  createNotification,
  getNotifications,
} from "../controllers/notification.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createNotificationSchema,
} from "../validations/notification.validation.js";

const router = Router();

/**
 * Every route below requires JWT
 */
router.use(authMiddleware);


router.get("/", getNotifications);


router.post(
  "/",
  validate(createNotificationSchema),
  createNotification
);

export default router;