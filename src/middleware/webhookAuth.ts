import { NextFunction, Request, Response } from "express";
import { validateWebhookSignature } from "@/utils/webhook";

export const verifyWebhookSignature = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signatureHeader = req.get("x-webhook-secret");

  if (!signatureHeader) {
    return res.status(401).json({ error: "Bad Request" });
  }

  const isValid = validateWebhookSignature(signatureHeader);

  if (!isValid) {
    return res
      .status(403)
      .json({ error: "Unauthorized: Invalid webhook secret" });
  }
  next();
};
