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
    const { token, type } = request.query;

    if (!token || typeof token !== "string") {
      return response.status(400).json({ error: "Invalid token" });
    }

    // Verify the magic link token
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type as any || "magiclink",
    });

    if (error || !data.user) {
      return response.status(401).json({ error: "Invalid or expired magic link" });
    }

    if (!data.session) {
      return response.status(401).json({ error: "No session data returned" });
    }

    // Check if user is admin
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id, email, role")
      .eq("id", data.user.id)
      .single();

    if (!adminUser) {
      await supabase.auth.admin.deleteUser(data.user.id);
      return response.status(403).json({ error: "Access denied - Not an admin user" });
    }

    // Create session
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    if (sessionError) {
      return response.status(500).json({ error: "Failed to create session" });
    }

    // Redirect to admin dashboard with session
    const adminUrl = process.env.ADMIN_URL || "http://localhost:3000/admin";
    const redirectUrl = `${adminUrl}?session=${encodeURIComponent(JSON.stringify(sessionData.session))}`;

    return response.redirect(302, redirectUrl);
  } catch (error) {
    console.error("Auth verify error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}