/**
 * auth.routes.js — Auth routes on the GATEWAY
 *
 * Client (React / Postman) calls:
 *   POST /api/auth/signup
 *   POST /api/auth/login
 *   GET  /api/auth/profile
 *
 * Gateway forwards to auth-service:
 *   POST http://localhost:5003/signup
 *   POST http://localhost:5003/login
 *   GET  http://localhost:5003/profile
 */

import { Router } from "express";
import { forwardRequest } from "../utils/forwardRequest.js";

const router = Router();

const authBaseUrl = process.env.AUTH_SERVICE_URL || "http://localhost:5003";

// POST /api/auth/signup  →  auth-service POST /signup
router.post("/signup", async (req, res) => {
  await forwardRequest(req, res, {
    baseUrl: authBaseUrl,
    method: "POST",
    path: "/signup",
    serviceName: "Auth service",
  });
});

// POST /api/auth/login  →  auth-service POST /login
router.post("/login", async (req, res) => {
  await forwardRequest(req, res, {
    baseUrl: authBaseUrl,
    method: "POST",
    path: "/login",
    serviceName: "Auth service",
  });
});

// GET /api/auth/profile  →  auth-service GET /profile (Bearer token forwarded)
router.get("/profile", async (req, res) => {
  await forwardRequest(req, res, {
    baseUrl: authBaseUrl,
    method: "GET",
    path: "/profile",
    serviceName: "Auth service",
  });
});

export default router;
