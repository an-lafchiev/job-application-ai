import { z } from "zod";
import { Router } from "express";
import { ConversationStatus } from "@prisma/client";
import { authenticateToken } from "@/middleware/auth";
import { validateParams, validateQuery } from "../middleware/validation";
import {
  getConversation,
  getConversations,
} from "@/controllers/conversationController";

const router = Router();

const conversationQuerySchema = z.object({
  status: z.enum(ConversationStatus).optional(),
});

const conversationParamsSchema = z.object({
  id: z.uuid({ message: "Invalid conversation ID format" }),
});

router.use(authenticateToken);

router.get("/", validateQuery(conversationQuerySchema), getConversations);

router.get("/:id", validateParams(conversationParamsSchema), getConversation);

export default router;
