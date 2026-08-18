import { z } from "zod";

export const createBroadcastSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(150, "Title must be under 150 characters."),

  message: z
    .string()
    .trim()
    .min(3, "Message must be at least 3 characters.")
    .max(2000, "Message must be under 2000 characters."),

  link: z
    .string()
    .trim()
    .url("Must be a valid URL.")
    .optional()
    .or(z.literal("")),

  linkLabel: z
    .string()
    .trim()
    .min(1)
    .max(50, "Link label must be under 50 characters.")
    .optional()
    .or(z.literal("")),

  level: z.enum(["INFO", "WARNING", "CRITICAL"], {
    message: "Select a severity level.",
  }),
});

export type CreateBroadcastSchema = z.infer<typeof createBroadcastSchema>;
