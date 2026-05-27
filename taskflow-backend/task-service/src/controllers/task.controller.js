/**
 * task.controller.js — Task CRUD logic
 *
 * Every query filters by req.user.id (from JWT).
 * Users only see and change their own tasks.
 */

import prisma from "../prisma/prismaClient.js";

import { taskProducer } from "../producer/notification.producer.js";
import crypto from "crypto";

/**
 * POST /tasks
 */
export async function createTask(req, res) {
  try {
    const { title, description, status, priority } = req.validated;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        priority,
        userId: req.user.id,
      },
    });
    console.log(task,"controller>>>>>")

    // Publish Kafka event
    await taskProducer("task-created",{
      eventId:crypto.randomUUID(),
      taskId: task.id,
      userId: req.user.id,
      title: task.title,
      email:req.user.email,
      description: task.description,
      status: task.status,
      priority: task.priority,
      message: `Task "${task.title}" created`,
    });

    return res.status(201).json({
      success: true,
      message: "Task created",
      task,
    });
  } catch (error) {
    console.error("createTask error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
}

/**
 * GET /tasks — only current user's tasks
 */
export async function getTasks(req, res) {
  try {
    const { status, priority, search } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user.id,
        ...(status && { status }),
        ...(priority && { priority }),
        ...(search && {
          OR: [
            {
              title: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              description: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("getTasks error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
}

/**
 * GET /tasks/stats
 */
export async function getTaskStats(req, res) {
  try {
    const userId = req.user.id;

    const [totalTasks, completedTasks] = await Promise.all([
      prisma.task.count({
        where: { userId },
      }),

      prisma.task.count({
        where: {
          userId,
          status: "COMPLETED",
        },
      }),
    ]);

    return res.status(200).json({
      success: true,
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
    });
  } catch (error) {
    console.error("getTaskStats error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
    });
  }
}

/**
 * GET /tasks/:id
 */
export async function getTaskById(req, res) {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error("getTaskById error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch task",
    });
  }
}

/**
 * PUT /tasks/:id
 */
export async function updateTask(req, res) {
  try {
    const existing = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const task = await prisma.task.update({
      where: {
        id: req.params.id,
      },
      data: req.validated,
    });
   

    // Publish Kafka event
    await taskProducer("task-updated",{
      eventId:crypto.randomUUID(),
      taskId: task.id,
      email:req.user.email,
      userId: task.userId,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      message: `Task "${task.title}" updated`,
    });

    return res.status(200).json({
      success: true,
      message: "Task updated",
      task,
    });
  } catch (error) {
    console.error("updateTask error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
}

/**
 * DELETE /tasks/:id
 */
export async function deleteTask(req, res) {
  try {
    const existing = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id,
      },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: {
        id: req.params.id,
      },
    });

    // Publish Kafka event
    await taskProducer("task-deleted",{
      eventId:crypto.randomUUID(),
      taskId: existing.id,
      email:req.user.email,
      userId: existing.userId,
      message: `Task "${existing.title}" deleted`,
    });

    return res.status(200).json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    console.error("deleteTask error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
}