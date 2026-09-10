import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./utils/supabase";
import { z } from "zod";

// Re-export utilities for internal use
export * from "./utils/supabase";
export * from "./utils/auth";
export * from "./utils/email";
export * from "./utils/validation";
export * from "./utils/rate-limit";
export * from "./utils/product-validation";

const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function setCors(response: VercelResponse) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.setHeader(key, value);
  });
}

function handleOptions(response: VercelResponse) {
  return response.status(200).end();
}

async function handleAuthLogin(request: VercelRequest, response: VercelResponse) {
  const loginSchema = z.object({ email: z.string().email() });
  
  if (request.method === "OPTIONS") return handleOptions(response);
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });

  try {
    const validationResult = loginSchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid email",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const { email } = validationResult.data;
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id, email")
      .eq("email", email)
      .single();

    // Don't reveal if user exists
    if (!adminUser) {
      return response.status(200).json({ success: true, message: "If the email is registered, a magic link has been sent" });
    }

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

async function handleAuthPassword(request: VercelRequest, response: VercelResponse) {
  if (request.method === "OPTIONS") return handleOptions(response);
  return response.status(405).json({ error: "Method not allowed" });
}

async function handleAuthVerify(request: VercelRequest, response: VercelResponse) {
  if (request.method === "OPTIONS") return handleOptions(response);
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });

  try {
    const { token, type } = request.query;
    if (!token || typeof token !== "string") {
      return response.status(400).json({ error: "Invalid token" });
    }

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

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id, email, role")
      .eq("id", data.user.id)
      .single();

    if (!adminUser) {
      await supabase.auth.admin.deleteUser(data.user.id);
      return response.status(403).json({ error: "Access denied - Not an admin user" });
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    });

    if (sessionError) {
      return response.status(500).json({ error: "Failed to create session" });
    }

    const adminUrl = process.env.ADMIN_URL || "http://localhost:3000/admin";
    const redirectUrl = `${adminUrl}?session=${encodeURIComponent(JSON.stringify(sessionData.session))}`;
    return response.redirect(302, redirectUrl);
  } catch (error) {
    console.error("Auth verify error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function handleInquiriesCreate(request: VercelRequest, response: VercelResponse) {
  const { inquirySchema } = await import("./utils/validation");
  const { sendAdminNotification, sendCustomerConfirmation } = await import("./utils/email");
  const { checkRateLimit, getRateLimitHeaders } = await import("./utils/rate-limit");

  if (request.method === "OPTIONS") return handleOptions(response);
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });

  const rateLimit = checkRateLimit(request);
  const rateLimitHeaders = getRateLimitHeaders(rateLimit);
  Object.entries(rateLimitHeaders).forEach(([key, value]) => response.setHeader(key, value));

  if (!rateLimit.allowed) {
    return response.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
    });
  }

  try {
    const validationResult = inquirySchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid request data",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const data = validationResult.data;
    const { data: inquiry, error: dbError } = await supabase
      .from("inquiries")
      .insert({
        name: data.name,
        phone: data.phone,
        event_type: data.eventType || null,
        message: data.message || null,
        source: data.source,
        page_url: data.pageUrl || null,
        user_agent: data.userAgent || request.headers["user-agent"] || null,
        referrer: data.referrer || request.headers.referer || null,
        status: "new",
        priority: 0,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return response.status(500).json({ error: "Failed to save inquiry" });
    }

    sendAdminNotification({
      name: inquiry.name,
      phone: inquiry.phone,
      eventType: inquiry.event_type || undefined,
      message: inquiry.message || undefined,
      source: inquiry.source,
      pageUrl: inquiry.page_url || undefined,
      createdAt: inquiry.created_at,
    }).catch(console.error);

    sendCustomerConfirmation({
      name: inquiry.name,
      phone: inquiry.phone,
      source: inquiry.source,
      createdAt: inquiry.created_at,
    }).catch(console.error);

    return response.status(201).json({
      success: true,
      inquiry: { id: inquiry.id, status: inquiry.status, createdAt: inquiry.created_at },
    });
  } catch (error) {
    console.error("Inquiry creation error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function handleSwatchCreate(request: VercelRequest, response: VercelResponse) {
  const { swatchRequestSchema } = await import("./utils/validation");
  const { sendAdminNotification } = await import("./utils/email");
  const { checkRateLimit, getRateLimitHeaders } = await import("./utils/rate-limit");

  if (request.method === "OPTIONS") return handleOptions(response);
  if (request.method !== "POST") return response.status(405).json({ error: "Method not allowed" });

  const rateLimit = checkRateLimit(request);
  const rateLimitHeaders = getRateLimitHeaders(rateLimit);
  Object.entries(rateLimitHeaders).forEach(([key, value]) => response.setHeader(key, value));

  if (!rateLimit.allowed) {
    return response.status(429).json({
      error: "Too many requests. Please try again later.",
      retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000),
    });
  }

  try {
    const validationResult = swatchRequestSchema.safeParse(request.body);
    if (!validationResult.success) {
      return response.status(400).json({
        error: "Invalid request data",
        details: validationResult.error.flatten().fieldErrors,
      });
    }

    const data = validationResult.data;
    const { data: swatch, error: dbError } = await supabase
      .from("swatch_requests")
      .insert({
        name: data.name,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        products_requested: data.productsRequested || [],
        inquiry_id: data.inquiryId || null,
        status: "pending",
        tracking_number: null,
        estimated_delivery: null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return response.status(500).json({ error: "Failed to save swatch request" });
    }

    sendAdminNotification({
      name: data.name,
      phone: data.phone,
      eventType: undefined,
      message: `Swatch request for: ${data.address.line1}, ${data.address.city}, ${data.address.pincode}`,
      source: "swatch",
      pageUrl: undefined,
      createdAt: swatch.created_at,
    }).catch(console.error);

    return response.status(201).json({
      success: true,
      swatch: { id: swatch.id, status: swatch.status, createdAt: swatch.created_at },
    });
  } catch (error) {
    console.error("Swatch creation error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function handleProductsList(request: VercelRequest, response: VercelResponse) {
  if (request.method === "OPTIONS") return handleOptions(response);
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });

  try {
    const { category, featured, active, limit, offset, search } = request.query;
    let query = supabase
      .from("products")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (active !== undefined) query = query.eq("active", active === "true");
    if (category) query = query.eq("category", category);
    if (featured !== undefined) query = query.eq("featured", featured === "true");
    if (search) query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`);
    if (limit) query = query.limit(parseInt(limit as string, 10));
    if (offset) query = query.range(parseInt(offset as string, 10), parseInt(offset as string, 10) + (parseInt(limit as string, 10) || 20) - 1);

    const { data: products, error, count } = await query;
    if (error) {
      console.error("Products list error:", error);
      return response.status(500).json({ error: "Failed to fetch products" });
    }
    return response.status(200).json({ products: products || [], total: count || products?.length || 0 });
  } catch (error) {
    console.error("Products list error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function handleProductsGet(request: VercelRequest, response: VercelResponse) {
  if (request.method === "OPTIONS") return handleOptions(response);
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });

  try {
    const { slug } = request.query;
    if (!slug || typeof slug !== "string") {
      return response.status(400).json({ error: "Product slug required" });
    }
    const { data: product, error } = await supabase.from("products").select("*").eq("slug", slug).single();
    if (error) {
      if (error.code === "PGRST116") return response.status(404).json({ error: "Product not found" });
      return response.status(500).json({ error: "Failed to fetch product" });
    }
    return response.status(200).json({ product });
  } catch (error) {
    console.error("Product get error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function handleSwatchList(request: VercelRequest, response: VercelResponse) {
  const { withAuth } = await import("./utils/auth");
  
  const handler = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method === "OPTIONS") return handleOptions(res);
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    try {
      const { status, limit, offset } = req.query;
      let query = supabase.from("swatch_requests").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (status) query = query.eq("status", status);
      if (limit) query = query.limit(parseInt(limit as string, 10));
      if (offset) query = query.range(parseInt(offset as string, 10), parseInt(offset as string, 10) + (parseInt(limit as string, 10) || 20) - 1);
      const { data: swatches, error, count } = await query;
      if (error) return res.status(500).json({ error: "Failed to fetch swatch requests" });
      return res.status(200).json({ swatches: swatches || [], total: count || swatches?.length || 0 });
    } catch (error) {
      console.error("Swatch list error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  return withAuth(handler)(request, response);
}

async function handleAdminInquiries(request: VercelRequest, response: VercelResponse) {
  const { withAuth } = await import("./utils/auth");
  
  const handler = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method === "OPTIONS") return handleOptions(res);
    
    const path = req.url || "";
    const method = req.method;

    if (path.includes("/inquiries/admin") && method === "GET" && path.includes("/inquiries/admin/")) {
      // GET single inquiry
      const id = path.split("/").pop();
      if (!id) return res.status(400).json({ error: "Inquiry ID required" });
      const { data: inquiry, error } = await supabase.from("inquiries").select("*").eq("id", id).single();
      if (error) {
        if (error.code === "PGRST116") return res.status(404).json({ error: "Inquiry not found" });
        return res.status(500).json({ error: "Failed to fetch inquiry" });
      }
      const { data: swatchRequests } = await supabase.from("swatch_requests").select("*").eq("inquiry_id", id).order("created_at", { ascending: false });
      return res.status(200).json({ inquiry: { ...inquiry, swatchRequests: swatchRequests || [] } });
    }

    if (path.includes("/inquiries/admin") && method === "GET") {
      // List inquiries
      const { status, limit, offset, search } = req.query;
      let query = supabase.from("inquiries").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (status) query = query.eq("status", status);
      if (search) query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
      if (limit) query = query.limit(parseInt(limit as string, 10));
      if (offset) query = query.range(parseInt(offset as string, 10), parseInt(offset as string, 10) + (parseInt(limit as string, 10) || 20) - 1);
      const { data: inquiries, error, count } = await query;
      if (error) return res.status(500).json({ error: "Failed to fetch inquiries" });
      return res.status(200).json({ inquiries: inquiries || [], total: count || inquiries?.length || 0 });
    }

    if (path.includes("/inquiries/admin/stats") && method === "GET") {
      const { count: total } = await supabase.from("inquiries").select("*", { count: "exact", head: true });
      const { count: newCount } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new");
      const { count: contacted } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "contacted");
      const { count: quoted } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "quoted");
      const { count: converted } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "converted");
      const { count: spam } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "spam");
      const { count: thisMonth } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
      return res.status(200).json({ total: total || 0, new: newCount || 0, contacted: contacted || 0, quoted: quoted || 0, converted: converted || 0, spam: spam || 0, thisMonth: thisMonth || 0 });
    }

    if (path.includes("/inquiries/admin") && method === "PATCH") {
      const updateSchema = z.object({
        status: z.enum(["new", "contacted", "quoted", "converted", "spam", "archived"]).optional(),
        priority: z.number().int().optional(),
        notes: z.string().optional(),
        respondedBy: z.string().optional(),
      });
      const id = path.split("/").pop();
      if (!id) return res.status(400).json({ error: "Inquiry ID required" });
      const validationResult = updateSchema.safeParse(req.body);
      if (!validationResult.success) return res.status(400).json({ error: "Invalid data", details: validationResult.error.flatten().fieldErrors });
      const data = validationResult.data;
      const { data: currentInquiry } = await supabase.from("inquiries").select("*").eq("id", id).single();
      if (!currentInquiry) return res.status(404).json({ error: "Inquiry not found" });
      const updateData: Record<string, any> = {};
      if (data.status !== undefined) updateData.status = data.status;
      if (data.priority !== undefined) updateData.priority = data.priority;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.respondedBy !== undefined) updateData.responded_by = data.respondedBy;
      if (data.status && data.status !== "new" && !currentInquiry.responded_at) updateData.responded_at = new Date().toISOString();
      if (Object.keys(updateData).length === 0) return res.status(400).json({ error: "No valid fields to update" });
      const { data: inquiry, error } = await supabase.from("inquiries").update(updateData).eq("id", id).select().single();
      if (error) return res.status(500).json({ error: "Failed to update inquiry" });
      const { sendStatusUpdateEmail } = await import("./utils/email");
      if (data.status && data.status !== currentInquiry.status) {
        sendStatusUpdateEmail({ name: inquiry.name, phone: inquiry.phone, email: inquiry.email || undefined, status: data.status, notes: data.notes }).catch(console.error);
      }
      return res.status(200).json({ inquiry });
    }

    return res.status(405).json({ error: "Method not allowed" });
  };
  
  return withAuth(handler)(request, response);
}

async function handleAdminProducts(request: VercelRequest, response: VercelResponse) {
  const { withAuth } = await import("./utils/auth");
  const { productSchema, productUpdateSchema } = await import("./utils/product-validation");
  
  const handler = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method === "OPTIONS") return handleOptions(res);
    
    const path = req.url || "";
    const method = req.method;

    if (method === "POST" && path.includes("/products/admin")) {
      // Create product
      const validationResult = productSchema.safeParse(req.body);
      if (!validationResult.success) return res.status(400).json({ error: "Invalid product data", details: validationResult.error.flatten().fieldErrors });
      const data = validationResult.data;
      const { data: product, error } = await supabase.from("products").insert({
        slug: data.slug, title: data.title, overline: data.overline || null, description: data.description || null,
        images: data.images || [], category: data.category || null, gsm: data.gsm || null,
        width_cm: data.width_cm || null, composition: data.composition || null, colors: data.colors || null,
        min_order_meters: data.min_order_meters || null, price_per_meter: data.price_per_meter || null,
        featured: data.featured ?? false, active: data.active ?? true,
      }).select().single();
      if (error) {
        if (error.code === "23505") return res.status(409).json({ error: "Product with this slug already exists" });
        return res.status(500).json({ error: "Failed to create product" });
      }
      return res.status(201).json({ product });
    }

    if (method === "GET" && path.includes("/products/admin")) {
      // List products
      const { category, featured, active, limit, offset, search } = req.query;
      let query = supabase.from("products").select("*", { count: "exact" }).order("created_at", { ascending: false });
      if (active !== undefined) query = query.eq("active", active === "true");
      if (category) query = query.eq("category", category);
      if (featured !== undefined) query = query.eq("featured", featured === "true");
      if (search) query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`);
      if (limit) query = query.limit(parseInt(limit as string, 10));
      if (offset) query = query.range(parseInt(offset as string, 10), parseInt(offset as string, 10) + (parseInt(limit as string, 10) || 20) - 1);
      const { data: products, error, count } = await query;
      if (error) return res.status(500).json({ error: "Failed to fetch products" });
      return res.status(200).json({ products: products || [], total: count || products?.length || 0 });
    }

    if (method === "PATCH" && path.includes("/products/admin/")) {
      // Update product
      const id = path.split("/").pop();
      if (!id) return res.status(400).json({ error: "Product ID required" });
      const validationResult = productUpdateSchema.safeParse(req.body);
      if (!validationResult.success) return res.status(400).json({ error: "Invalid product data", details: validationResult.error.flatten().fieldErrors });
      const data = validationResult.data;
      const updateData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
      if (Object.keys(updateData).length === 0) return res.status(400).json({ error: "No valid fields to update" });
      const { data: product, error } = await supabase.from("products").update(updateData).eq("id", id).select().single();
      if (error) {
        if (error.code === "PGRST116") return res.status(404).json({ error: "Product not found" });
        if (error.code === "23505") return res.status(409).json({ error: "Product with this slug already exists" });
        return res.status(500).json({ error: "Failed to update product" });
      }
      return res.status(200).json({ product });
    }

    if (method === "DELETE" && path.includes("/products/admin/")) {
      const id = path.split("/").pop();
      if (!id) return res.status(400).json({ error: "Product ID required" });
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) return res.status(500).json({ error: "Failed to delete product" });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  };
  
  return withAuth(handler)(request, response);
}

async function handleAdminSwatch(request: VercelRequest, response: VercelResponse) {
  const { withAuth } = await import("./utils/auth");
  
  const handler = async (req: VercelRequest, res: VercelResponse) => {
    if (req.method === "OPTIONS") return handleOptions(res);
    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
    
    const { status, limit, offset } = req.query;
    let query = supabase.from("swatch_requests").select("*", { count: "exact" }).order("created_at", { ascending: false });
    if (status) query = query.eq("status", status);
    if (limit) query = query.limit(parseInt(limit as string, 10));
    if (offset) query = query.range(parseInt(offset as string, 10), parseInt(offset as string, 10) + (parseInt(limit as string, 10) || 20) - 1);
    const { data: swatches, error, count } = await query;
    if (error) return res.status(500).json({ error: "Failed to fetch swatch requests" });
    return res.status(200).json({ swatches: swatches || [], total: count || swatches?.length || 0 });
  };
  
  return withAuth(handler)(request, response);
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  setCors(response);
  const url = request.url || "";
  const method = request.method;

  // Auth routes
  if (url.includes("/auth/login")) return handleAuthLogin(request, response);
  if (url.includes("/auth/password")) return handleAuthPassword(request, response);
  if (url.includes("/auth/verify")) return handleAuthVerify(request, response);

  // Public API routes
  if (url.includes("/inquiries") && !url.includes("/admin")) return handleInquiriesCreate(request, response);
  if (url.includes("/swatch") && !url.includes("/admin")) return handleSwatchCreate(request, response);
  if (url.includes("/products") && !url.includes("/admin")) {
    if (method === "GET" && url.split("/").pop() !== "products") return handleProductsGet(request, response);
    return handleProductsList(request, response);
  }
  if (url.includes("/swatch") && !url.includes("/admin") && method === "GET") return handleSwatchList(request, response);

  // Admin routes (require auth)
  if (url.includes("/inquiries/admin")) return handleAdminInquiries(request, response);
  if (url.includes("/products/admin")) return handleAdminProducts(request, response);
  if (url.includes("/swatch/admin")) return handleAdminSwatch(request, response);

  return response.status(404).json({ error: "Not found" });
}