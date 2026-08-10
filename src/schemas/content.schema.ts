import { z } from "zod";

export const seoSchema = z.object({
  seoTitle: z.string().trim().max(60).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(160).optional().or(z.literal("")),
  focusKeyword: z.string().trim().max(100).optional().or(z.literal("")),
  canonicalUrl: z.string().trim().url("Must be a valid URL.").optional().or(z.literal("")),
  ogTitle: z.string().trim().max(60).optional().or(z.literal("")),
  ogDescription: z.string().trim().max(160).optional().or(z.literal("")),
  twitterTitle: z.string().trim().max(60).optional().or(z.literal("")),
  twitterDescription: z.string().trim().max(160).optional().or(z.literal("")),
  noIndex: z.boolean(),
  noFollow: z.boolean(),
});

export const contentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters.")
    .max(255, "Title must be under 255 characters."),

  excerpt: z
    .string()
    .trim()
    .max(1000, "Excerpt must be under 1000 characters.")
    .optional()
    .or(z.literal("")),

  content: z
    .string()
    .min(20, "Content must be at least 20 characters."),

  categoryId: z
    .string()
    .min(1, "Category is required."),

  contentTypeId: z
    .string()
    .min(1, "Content type is required."),

  authorId: z
    .string()
    .min(1, "Author is required."),

  coverImageId: z
    .string()
    .optional()
    .or(z.literal("")),

  // No .default() — Zod v4 splits input/output types which breaks useForm resolver
  tagIds: z.array(z.string()),

  visibility: z.enum(["PUBLIC", "PRIVATE", "MEMBERS_ONLY"]),

  allowComments: z.boolean(),
  isFeatured: z.boolean(),
  isBreaking: z.boolean(),
  isPinned: z.boolean(),

  seo: seoSchema.optional(),
});

export type ContentSchema = z.infer<typeof contentSchema>;
export type SeoSchema = z.infer<typeof seoSchema>;