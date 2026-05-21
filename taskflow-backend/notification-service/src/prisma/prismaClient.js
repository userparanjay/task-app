/**
 * prismaClient.js
 *
 * Responsibility:
 * - Create Prisma client instance
 * - Connect database when server starts
 * - Export prisma instance for controllers
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDatabase() {
  await prisma.$connect();
  console.log("PostgreSQL connected via Prisma (notification_db)");
}

export default prisma;