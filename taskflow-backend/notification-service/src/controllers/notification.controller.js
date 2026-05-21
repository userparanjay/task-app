/**
 * notification.controller.js — Notification CRUD logic
 *
 * Every query filters by req.user.id (from JWT).
 * Users only see their own notifications.
 */

import prisma  from "../prisma/prismaClient.js";

/**
 * POST /notifications
 */
export async function createNotification(req, res) {
  try {
    const { message, userId } = req.validated;

    const notification = await prisma.notification.create({
      data: {
        message,
        userId,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Notification created",
      notification,
    });
  } catch (error) {
    console.error("createNotification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create notification",
    });
  }
}

/**
 * GET /notifications
 *
 * Only logged-in user's notifications
 */
export async function getNotifications(req, res) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("getNotifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
}