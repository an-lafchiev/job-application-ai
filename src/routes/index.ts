import { z } from "zod";
import { Router } from "express";
import { helloWorldController } from "@/controllers/helloWorldController";
import { verifyWebhookSignature } from "@/middleware/webhookAuth";
import { validateBody } from "../middleware/validation";
import { handleNewApplication } from "@/controllers/applicationController";

export const createConversationSchema = z.object({
  id: z.string(),
  job_id: z.string(),
  candidate_id: z.string(),
  candidate: z.object({
    phone_number: z.e164(),
    first_name: z.string(),
    last_name: z.string(),
    email_address: z.email(),
  }),
});

const router = Router();

router.get("/hello", helloWorldController);

router.post(
  "/webhook/receive-application",
  verifyWebhookSignature,
  validateBody(createConversationSchema),
  handleNewApplication
);

export default router;
