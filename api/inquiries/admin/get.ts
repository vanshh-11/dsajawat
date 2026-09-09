import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../utils/supabase";
import { withAuth } from "../../utils/auth";

async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = request.query;

    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "Inquiry ID required" });
    }

    const { data: inquiry, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return response.status(404).json({ error: "Inquiry not found" });
      }
      console.error("Admin inquiry get error:", error);
      return response.status(500).json({ error: "Failed to fetch inquiry" });
    }

    // Get related swatch requests
    const { data: swatchRequests } = await supabase
      .from("swatch_requests")
      .select("*")
      .eq("inquiry_id", id)
      .order("created_at", { ascending: false });

    return response.status(200).json({
      inquiry: { ...inquiry, swatchRequests: swatchRequests || [] },
    });
  } catch (error) {
    console.error("Admin inquiry get error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler);