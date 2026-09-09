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
    const { category, featured, active, limit, offset, search } = request.query;

    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (active !== undefined) {
      query = query.eq("active", active === "true");
    }

    if (category) {
      query = query.eq("category", category);
    }

    if (featured !== undefined) {
      query = query.eq("featured", featured === "true");
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`);
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

    const { data: products, error, count } = await query;

    if (error) {
      console.error("Admin products list error:", error);
      return response.status(500).json({ error: "Failed to fetch products" });
    }

    return response.status(200).json({
      products: products || [],
      total: count || products?.length || 0,
    });
  } catch (error) {
    console.error("Admin products list error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler);