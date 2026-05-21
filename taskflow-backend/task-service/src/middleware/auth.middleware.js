/**
 * auth.middleware.js — Verify JWT from Auth Service
 *
 * Auth Service signs tokens with the same JWT_SECRET.
 * We only read the token — we do NOT call auth-service on every request.
 *
 * Token payload example: { id: "uuid", email: "user@test.com" }
 * After verify: req.user.id is used to save/find tasks
 */

import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
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

    // Same secret as auth-service — tokens work across microservices
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
}
