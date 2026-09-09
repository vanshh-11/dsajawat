import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../utils/supabase";

export default async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "GET") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { slug } = request.query;

    if (!slug || typeof slug !== "string") {
      return response.status(400).json({ error: "Product slug required" });
    }

    const { data: product, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return response.status(404).json({ error: "Product not found" });
      }
      console.error("Product get error:", error);
      return response.status(500).json({ error: "Failed to fetch product" });
    }

    return response.status(200).json({ product });
  } catch (error) {
    console.error("Product get error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}