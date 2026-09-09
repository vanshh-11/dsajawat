import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../utils/supabase";
import { z } from "zod";
import crypto from "crypto";

const passwordSchema = z.object({
  password: z.string().min(1),
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
    const validationResult = passwordSchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({ error: "Password required" });
    }

    const { password } = validationResult.data;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return response.status(500).json({ error: "Admin password not configured" });
    }

    // Simple password check (use proper hashing in production)
    const expectedHash = crypto.createHash("sha256").update(adminPassword).digest("hex");
    const providedHash = crypto.createHash("sha256").update(password).digest("hex");

    if (providedHash !== expectedHash) {
      return response.status(401).json({ error: "Invalid password" });
    }

    // Create a simple admin user or get existing
    const adminEmail = "admin@dsajawat.com";
    let { data: adminUser } = await supabase
      .from("admin_users")
      .select("id, email, role")
      .eq("email", adminEmail)
      .single();

    if (!adminUser) {
      const { data: newUser, error } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: { role: "admin" },
      });

      if (error || !newUser.user) {
        return response.status(500).json({ error: "Failed to create admin user" });
      }

      const { error: insertError } = await supabase
        .from("admin_users")
        .insert({
          id: newUser.user.id,
          email: adminEmail,
          role: "admin",
        });

      if (insertError) {
        return response.status(500).json({ error: "Failed to link admin user" });
      }

      adminUser = { id: newUser.user.id, email: adminEmail, role: "admin" };
    }

    // Sign in with password
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });

    if (authError || !authData.session) {
      return response.status(401).json({ error: "Authentication failed" });
    }

    return response.status(200).json({
      success: true,
      session: authData.session,
      user: { id: adminUser.id, email: adminUser.email, role: adminUser.role },
    });
  } catch (error) {
    console.error("Password login error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}