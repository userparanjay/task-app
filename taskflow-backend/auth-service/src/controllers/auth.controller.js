/**
 * auth.controller.js — Business logic (validation done in middleware)
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { createUser, findUserByEmail } from "../data/users.js";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

export async function signup(req, res) {
  try {
    const { name, email, password } = req.validated;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    console.error("Signup error:", error);
    const message =
      process.env.NODE_ENV === "production"
        ? "Server error during signup"
        : error.message || "Server error during signup";
    return res.status(500).json({
      success: false,
      message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.validated;

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
}

export function getProfile(req, res) {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
}
