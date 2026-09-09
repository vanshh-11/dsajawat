import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../utils/supabase";
import { inquirySchema } from "../utils/validation";
import { sendAdminNotification, sendCustomerConfirmation } from "../utils/email";
import { checkRateLimit, getRateLimitHeaders } from "../utils/rate-limit";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  // CORS headers
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
    // Validate request body
    const validationResult = inquirySchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid request data",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const data = validationResult.data;

    // Insert into database
    const { data: inquiry, error: dbError } = await supabase
      .from("inquiries")
      .insert({
        name: data.name,
        phone: data.phone,
        event_type: data.eventType || null,
        message: data.message || null,
        source: data.source,
        page_url: data.pageUrl || null,
        user_agent: data.userAgent || request.headers["user-agent"] || null,
        referrer: data.referrer || request.headers.referer || null,
        status: "new",
        priority: 0,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return response.status(500).json({ error: "Failed to save inquiry" });
    }

    // Send emails (don't await - fire and forget)
    sendAdminNotification({
      name: inquiry.name,
      phone: inquiry.phone,
      eventType: inquiry.event_type || undefined,
      message: inquiry.message || undefined,
      source: inquiry.source,
      pageUrl: inquiry.page_url || undefined,
      createdAt: inquiry.created_at,
    }).catch(console.error);

    sendCustomerConfirmation({
      name: inquiry.name,
      phone: inquiry.phone,
      source: inquiry.source,
      createdAt: inquiry.created_at,
    }).catch(console.error);

    return response.status(201).json({
      success: true,
      inquiry: {
        id: inquiry.id,
        status: inquiry.status,
        createdAt: inquiry.created_at,
      },
    });
  } catch (error) {
    console.error("Inquiry creation error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}