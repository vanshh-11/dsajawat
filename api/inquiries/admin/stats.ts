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
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total inquiries
    const { count: total } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true });

    // This week
    const { count: thisWeek } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString());

    // This month
    const { count: thisMonth } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .gte("created_at", monthAgo.toISOString());

    // By status
    const { data: byStatus } = await supabase
      .from("inquiries")
      .select("status")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        data?.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1; });
        return { data: counts };
      });

    // By source
    const { data: bySource } = await supabase
      .from("inquiries")
      .select("source")
      .then(({ data }) => {
        const counts: Record<string, number> = {};
        data?.forEach((i) => { counts[i.source] = (counts[i.source] || 0) + 1; });
        return { data: counts };
      });

    // Conversion rate (converted / total)
    const converted = byStatus?.converted || 0;
    const conversionRate = total ? ((converted / total) * 100).toFixed(1) : "0";

    // Average response time (for responded inquiries)
    const { data: responded } = await supabase
      .from("inquiries")
      .select("created_at, responded_at")
      .not("responded_at", "is", null);

    let avgResponseTime = "N/A";
    if (responded && responded.length > 0) {
      const totalMs = responded.reduce((sum, i) => {
        return sum + (new Date(i.responded_at).getTime() - new Date(i.created_at).getTime());
      }, 0);
      const avgMs = totalMs / responded.length;
      const avgHours = (avgMs / (1000 * 60 * 60)).toFixed(1);
      avgResponseTime = `${avgHours}h`;
    }

    // Swatch requests stats
    const { count: totalSwatches } = await supabase
      .from("swatch_requests")
      .select("*", { count: "exact", head: true });

    const { count: pendingSwatches } = await supabase
      .from("swatch_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending");

    return response.status(200).json({
      stats: {
        inquiries: {
          total: total || 0,
          thisWeek: thisWeek || 0,
          thisMonth: thisMonth || 0,
          conversionRate: `${conversionRate}%`,
          avgResponseTime,
          byStatus: byStatus || {},
          bySource: bySource || {},
        },
        swatches: {
          total: totalSwatches || 0,
          pending: pendingSwatches || 0,
        },
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default withAuth(handler);