import type { VercelRequest, VercelResponse } from "@vercel/node";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX_REQUESTS = 10; // 10 requests per hour per IP

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function getClientIp(request: VercelRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

export function checkRateLimit(request: VercelRequest): { allowed: boolean; remaining: number; resetTime: number } {
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetTime: entry.resetTime };
  }

  entry.count++;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - entry.count, resetTime: entry.resetTime };
}

export function getRateLimitHeaders(result: { remaining: number; resetTime: number }) {
  return {
    "X-RateLimit-Limit": RATE_LIMIT_MAX_REQUESTS.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": Math.ceil(result.resetTime / 1000).toString(),
  };
}

// Cleanup old entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);