import { Router } from "express";
import { signup, login, getProfile } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginSchema, signupSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/profile", authMiddleware, getProfile);

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

export default router;
