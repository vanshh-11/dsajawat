import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../../utils/supabase";
import { productSchema } from "../../utils/product-validation";
import { withAuth } from "../../utils/auth";

async function handler(request: VercelRequest, response: VercelResponse) {
  response.setHeader("Access-Control-Allow-Credentials", "true");
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return response.status(200).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const validationResult = productSchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid product data",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const data = validationResult.data;

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        slug: data.slug,
        title: data.title,
        overline: data.overline || null,
        description: data.description || null,
        images: data.images || [],
        category: data.category || null,
        gsm: data.gsm || null,
        width_cm: data.width_cm || null,
        composition: data.composition || null,
        colors: data.colors || null,
        min_order_meters: data.min_order_meters || null,
        price_per_meter: data.price_per_meter || null,
        featured: data.featured ?? false,
        active: data.active ?? true,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return response.status(409).json({ error: "Product with this slug already exists" });
      }
      console.error("Product create error:", error);
      return response.status(500).json({ error: "Failed to create product" });
    }

    return response.status(201).json({ product });
  } catch (error) {
    console.error("Product create error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler);