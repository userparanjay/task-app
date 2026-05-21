/**
 * prisma.js — Single Prisma Client instance (ORM)
 *
 * Import this everywhere you need database access.
 * Do not create new PrismaClient() in every file.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function connectDatabase() {
  await prisma.$connect();
  console.log("PostgreSQL connected via Prisma");
}

export default prisma;
