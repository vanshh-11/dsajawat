import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../utils/supabase";
import { productUpdateSchema } from "../../utils/product-validation";
import { withAuth } from "../../utils/auth";

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
      return response.status(400).json({ error: "Product ID required" });
    }

    const validationResult = productUpdateSchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid product data",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const data = validationResult.data;

    // Remove undefined values
    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(updateData).length === 0) {
      return response.status(400).json({ error: "No valid fields to update" });
    }

    const { data: product, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return response.status(404).json({ error: "Product not found" });
      }
      if (error.code === "23505") {
        return response.status(409).json({ error: "Product with this slug already exists" });
      }
      console.error("Product update error:", error);
      return response.status(500).json({ error: "Failed to update product" });
    }

    return response.status(200).json({ product });
  } catch (error) {
    console.error("Product update error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler);