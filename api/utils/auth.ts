import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./supabase";

export interface AuthenticatedRequest extends VercelRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function requireAuth(
  request: VercelRequest,
  response: VercelResponse
): Promise<{ user: AuthenticatedRequest["user"] } | null> {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    response.status(401).json({ error: "Unauthorized - No token provided" });
    return null;
  }

  const token = authHeader.replace("Bearer ", "");

  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    response.status(401).json({ error: "Unauthorized - Invalid token" });
    return null;
  }

  // Check if user is admin
  const { data: adminUser } = await supabase
    .from("admin_users")
    .select("id, email, role")
    .eq("id", user.id)
    .single();

  if (!adminUser) {
    response.status(403).json({ error: "Forbidden - Admin access required" });
    return null;
  }

  return { user: { id: adminUser.id, email: adminUser.email, role: adminUser.role } };
}

export function withAuth(
  handler: (request: AuthenticatedRequest, response: VercelResponse, auth: { user: AuthenticatedRequest["user"] }) => Promise<void>
) {
  return async (request: VercelRequest, response: VercelResponse) => {
    const auth = await requireAuth(request, response);
    if (!auth) return;

    (request as AuthenticatedRequest).user = auth.user;
    return handler(request as AuthenticatedRequest, response, auth);
  };
}