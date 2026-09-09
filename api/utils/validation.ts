import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(20),
  eventType: z.string().max(50).optional(),
  message: z.string().max(2000).optional(),
  source: z.enum(["contact", "quote", "hero_cta", "collection_card"]),
  pageUrl: z.string().url().optional(),
  userAgent: z.string().optional(),
  referrer: z.string().optional(),
});

export const swatchRequestSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional().nullable(),
  address: z.object({
    line1: z.string().min(5),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().length(6),
    country: z.string().default("India"),
  }),
  productsRequested: z.array(z.string()).optional(),
  inquiryId: z.string().uuid().optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
export type SwatchRequestInput = z.infer<typeof swatchRequestSchema>;