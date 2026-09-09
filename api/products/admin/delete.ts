import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../utils/supabase";
import { withAuth } from "../../utils/auth";

async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "DELETE") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { id } = request.query;

    if (!id || typeof id !== "string") {
      return response.status(400).json({ error: "Product ID required" });
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error("Product delete error:", error);
      return response.status(500).json({ error: "Failed to delete product" });
    }

    return response.status(200).json({ success: true });
  } catch (error) {
    console.error("Product delete error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler);