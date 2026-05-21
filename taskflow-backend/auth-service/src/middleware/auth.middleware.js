/**
 * auth.middleware.js — Protect routes that need a logged-in user
 */

import jwt from "jsonwebtoken";
import { findUserById } from "../data/users.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ success: false, message: "Invalid token format" });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load user from PostgreSQL using id inside the token
    const user = await findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
