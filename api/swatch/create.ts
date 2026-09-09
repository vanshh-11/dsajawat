import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../utils/supabase";
import { swatchRequestSchema } from "../utils/validation";
import { sendSwatchConfirmation } from "../utils/email";
import { checkRateLimit, getRateLimitHeaders } from "../utils/rate-limit";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const rateLimit = checkRateLimit(request);
  const rateLimitHeaders = getRateLimitHeaders(rateLimit);
  Object.entries(rateLimitHeaders).forEach(([key, value]) => response.setHeader(key, value));

  if (!rateLimit.allowed) {
    return response.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
    });
  }

  try {
    const validationResult = swatchRequestSchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid request data",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const data = validationResult.data;

    const { data: swatchRequest, error } = await supabase
      .from("swatch_requests")
      .insert({
        inquiry_id: data.inquiryId || null,
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        products_requested: data.productsRequested || [],
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Swatch request error:", error);
      return response.status(500).json({ error: "Failed to submit swatch request" });
    }

    // Send confirmation email (async, don't await)
    sendSwatchConfirmation({
      name: swatchRequest.name,
      phone: swatchRequest.phone,
    }).catch(console.error);

    return response.status(201).json({
      success: true,
      swatchRequest: {
        id: swatchRequest.id,
        status: swatchRequest.status,
        createdAt: swatchRequest.created_at,
      },
    });
  } catch (error) {
    console.error("Swatch request error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}