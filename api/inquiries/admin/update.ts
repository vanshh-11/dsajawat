import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../utils/supabase";
import { withAuth } from "../../utils/auth";
import { sendStatusUpdateEmail } from "../../utils/email";
import { z } from "zod";

const statuses = ["new", "contacted", "quoted", "converted", "spam", "archived"] as const;

const updateSchema = z.object({
  status: z.enum(statuses).optional(),
  priority: z.number().int().optional(),
  notes: z.string().optional(),
  respondedBy: z.string().optional(),
});

async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "PATCH,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "PATCH") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = request.query;

    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "Inquiry ID required" });
    }

    const validationResult = updateSchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid data",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const data = validationResult.data;

    // Get current inquiry for email
    const { data: currentInquiry } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (!currentInquiry) {
      return response.status(404).json({ error: "Inquiry not found" });
    }

    const updateData: Record<string, any> = {};
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.respondedBy !== undefined) updateData.responded_by = data.respondedBy;

    if (data.status && data.status !== "new" && !currentInquiry.responded_at) {
      updateData.responded_at = new Date().toISOString();
    }

    if (Object.keys(updateData).length === 0) {
      return response.status(400).json({ error: "No valid fields to update" });
    }

    const { data: inquiry, error } = await supabase
      .from("inquiries")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Admin inquiry update error:", error);
      return response.status(500).json({ error: "Failed to update inquiry" });
    }

    // Send status update email if status changed
    if (data.status && data.status !== currentInquiry.status) {
      sendStatusUpdateEmail({
        name: inquiry.name,
        phone: inquiry.phone,
        email: inquiry.email || undefined,
        status: data.status,
        notes: data.notes,
      }).catch(console.error);
    }

    return response.status(200).json({ inquiry });
  } catch (error) {
    console.error("Admin inquiry update error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler);