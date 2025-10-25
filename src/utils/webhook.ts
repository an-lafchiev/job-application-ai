import env from "../../env";

export const validateWebhookSignature = (providedSecret: string): boolean =>
  providedSecret === env.WEBHOOK_SECRET;
