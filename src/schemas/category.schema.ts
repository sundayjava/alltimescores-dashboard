import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name must be under 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must be under 500 characters.")
    .optional()
    .or(z.literal("")),

  icon: z
    .string()
    .trim()
    .max(50)
    .optional()
    .or(z.literal("")),

  color: z
    .string()
    .trim()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a valid hex color.")
    .optional()
    .or(z.literal("")),

  parentId: z
    .string()
    .uuid("Must be a valid category ID.")
    .optional()
    .or(z.literal("")),

  sortOrder: z
    .number()
    .int()
    .min(0)
    .optional(),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  isActive: z.boolean().optional(),
  parentId: z
    .string()
    .uuid()
    .nullable()
    .optional()
    .or(z.literal("")),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;