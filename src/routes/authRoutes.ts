import { Router } from "express";
import { login, register } from "../controllers/authController";
import { validateBody } from "../middleware/validation";

import { z } from "zod";

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  email: z.email("Invalid email"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const router = Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

export default router;
