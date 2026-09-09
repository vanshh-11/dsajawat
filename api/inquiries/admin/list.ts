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
    const { status, source, limit, offset, search, dateFrom, dateTo } = request.query;

    let query = supabase
      .from("inquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    if (source) {
      query = query.eq("source", source);
    }

    if (dateFrom) {
      query = query.gte("created_at", dateFrom as string);
    }

    if (dateTo) {
      query = query.lte("created_at", dateTo as string);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,message.ilike.%${search}%`);
    }

    if (limit) {
      query = query.limit(parseInt(limit as string, 10));
    }

    if (offset) {
      query = query.range(
        parseInt(offset as string, 10),
        parseInt(offset as string, 10) + (parseInt(limit as string, 10) || 20) - 1
      );
    }

    const { data: inquiries, error, count } = await query;

    if (error) {
      console.error("Admin inquiries list error:", error);
      return response.status(500).json({ error: "Failed to fetch inquiries" });
    }

    return response.status(200).json({
      inquiries: inquiries || [],
      total: count || inquiries?.length || 0,
    });
  } catch (error) {
    console.error("Admin inquiries list error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler);