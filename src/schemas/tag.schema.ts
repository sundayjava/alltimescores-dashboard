import { z } from "zod";

export const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tag name must be at least 2 characters.")
    .max(100, "Tag name must be under 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters.")
    .optional()
    .or(z.literal("")),
});

export const updateTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Tag name must be at least 2 characters.")
    .max(100, "Tag name must be under 100 characters.")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters.")
    .optional()
    .or(z.literal("")),
});

export type CreateTagSchema = z.infer<typeof createTagSchema>;
export type UpdateTagSchema = z.infer<typeof updateTagSchema>;