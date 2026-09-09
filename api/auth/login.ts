import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../utils/supabase";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
});

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

  try {
    const validationResult = loginSchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid email",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const { email } = validationResult.data;

    // Check if admin user exists
    const { data: adminUser, error: userError } = await supabase
      .from("admin_users")
      .select("id, email")
      .eq("email", email)
      .single();

    if (userError || !adminUser) {
      // Don't reveal if user exists - always return success
      return response.status(200).json({ success: true, message: "If the email is registered, a magic link has been sent" });
    }

    // Send magic link
    const { error: authError } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: {
        redirectTo: `${process.env.ADMIN_URL || "http://localhost:3000"}/admin/callback`,
      },
    });

    if (authError) {
      console.error("Magic link error:", authError);
      return response.status(500).json({ error: "Failed to send magic link" });
    }

    return response.status(200).json({ success: true, message: "If the email is registered, a magic link has been sent" });
  } catch (error) {
    console.error("Auth login error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}