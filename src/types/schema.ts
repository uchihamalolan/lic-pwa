import { z } from "zod";

const notificationChannelSchema = z.enum(["whatsapp", "sms"]).nullable();
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;

const claimTypeSchema = z.union([z.enum(["M", "S"]), z.string().trim()]);

export const agentSchema = z.object({
  agent_code: z.string().transform((val) => val.trim().padStart(8, "0")),
  name: z.string().trim(),
  phone: z.string().trim().nullable(),
  do_code: z.string().trim(),
});
export type Agent = z.infer<typeof agentSchema>;

export const claimSchema = z.object({
  policy_no: z.string().trim(),
  agent_code: z.string().transform((val) => val.trim().padStart(8, "0")),
  claim_type: claimTypeSchema,
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  plan: z.string().trim(),
  amt_payable: z.number().nonnegative(),
  neft: z.boolean(),

  // Holder fields
  holder_name: z.string().trim(),
  holder_address: z.string().trim().nullable(),
  holder_phone: z.string().trim().nullable(),

  // Notification Tracking
  notified_via: notificationChannelSchema.default(null),
  notified_at: z.iso.datetime().nullable().default(null),
});
export type Claim = z.infer<typeof claimSchema>;
