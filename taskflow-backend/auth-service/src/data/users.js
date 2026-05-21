/**
 * users.js — User data access via Prisma ORM (no raw SQL)
 */

import { randomUUID } from "crypto";
import prisma from "../config/prisma.js";

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  });
}

export async function findUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true },
  });
}

export async function createUser({ name, email, password }) {
  return prisma.user.create({
    data: {
      id: randomUUID(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    },
    select: { id: true, name: true, email: true },
  });
}
