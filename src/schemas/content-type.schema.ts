import { z } from "zod";

export const createContentTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be under 100 characters."),

  description: z.string().max(500, "Description must be under 500 characters.").optional(),

  icon: z.string().max(50, "Icon name must be under 50 characters.").optional(),

  sortOrder: z
    .number()
    .int("Sort order must be a whole number.")
    .nonnegative("Sort order must be 0 or greater.")
    .optional(),
});

export const updateContentTypeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be under 100 characters.")
    .optional(),

  description: z.string().max(500, "Description must be under 500 characters.").optional(),

  icon: z.string().max(50, "Icon name must be under 50 characters.").optional(),

  sortOrder: z
    .number()
    .int("Sort order must be a whole number.")
    .nonnegative("Sort order must be 0 or greater.")
    .optional(),

  isActive: z.boolean().optional(),
});

export type CreateContentTypeSchema = z.infer<typeof createContentTypeSchema>;
export type UpdateContentTypeSchema = z.infer<typeof updateContentTypeSchema>;