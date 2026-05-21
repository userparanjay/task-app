/**
 * prismaClient.js — Prisma ORM connection for task-service only
 *
 * This service has its OWN database (task_db).
 * It does NOT connect to auth-service or user tables.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDatabase() {
  await prisma.$connect();
  console.log("PostgreSQL connected via Prisma (task_db)");
}

export default prisma;
