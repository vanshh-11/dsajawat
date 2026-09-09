import { z } from "zod";

export const productSchema = z.object({
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(2).max(200),
  overline: z.string().max(100).optional(),
  description: z.string().max(5000).optional(),
  images: z.array(z.string().url()).optional(),
  category: z.string().max(50).optional(),
  gsm: z.number().int().positive().optional(),
  width_cm: z.number().int().positive().optional(),
  composition: z.string().max(100).optional(),
  colors: z.record(z.string()).optional(),
  min_order_meters: z.number().int().positive().optional(),
  price_per_meter: z.number().positive().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

export const productUpdateSchema = productSchema.partial();

export type ProductInput = z.infer<typeof productSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;