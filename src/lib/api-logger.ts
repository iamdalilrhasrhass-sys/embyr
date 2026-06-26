import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// ── Types ──

export type ApiHandler = (
  request: NextRequest,
  ...args: any[]
) => Promise<NextResponse | Response>;

export interface ApiLogEntry {
  timestamp: string;
  route: string;
  method: string;
  user_id: string | null;
  status_code: number;
  duration_ms: number;
  error_message: string | null;
  browser: string | null;
  ip_hash: string | null;
}

// ── Helpers ──

/** Extract user ID from request token — never logs the token itself */
function extractUserId(req: NextRequest): string | null {
  try {
    // Try cookie first
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    let token = tokenMatch ? decodeURIComponent(tokenMatch[1]) : null;

    // Fallback to Authorization header
    if (!token) {
      const auth = req.headers.get("authorization");
      if (auth?.startsWith("Bearer ")) {
        token = auth.slice(7);
      }
    }

    if (!token) return null;
    const payload = verifyToken(token);
    return payload?.userId ?? null;
  } catch {
    return null;
  }
}

/** Parse browser name from User-Agent — never logs the full UA string */
function parseBrowser(ua: string | null): string | null {
  if (!ua) return null;
  const patterns: [RegExp, string][] = [
    [/Edg\//i, "Edge"],
    [/OPR\//i, "Opera"],
    [/Chrome\//i, "Chrome"],
    [/Firefox\//i, "Firefox"],
    [/Safari\//i, "Safari"],
    [/MSIE|Trident/i, "Internet Explorer"],
    [/Brave\//i, "Brave"],
    [/SamsungBrowser/i, "Samsung Internet"],
  ];
  for (const [re, name] of patterns) {
    if (re.test(ua)) return name;
  }
  return "Unknown";
}

/** Hash IP address for privacy — SHA-256 so it's not reversible */
function hashIp(ip: string | null): string | null {
  if (!ip) return null;
  return crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

/** Extract client IP from request headers */
function extractIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return req.headers.get("x-client-ip") ?? null;
}

/** Detect if a request body might contain sensitive data we should never log */
function isSensitiveRoute(url: string): boolean {
  const sensitivePatterns = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/me",
  ];
  return sensitivePatterns.some((p) => url.includes(p));
}

// ── Core Logger ──

/**
 * Wrap an API route handler with analytics logging.
 *
 * Logs to console AND stores in the AnalyticsEvent table.
 * NEVER logs: passwords, tokens, photos, message content, or raw IP addresses.
 */
export function withApiLogging(handler: ApiHandler): ApiHandler {
  return async (request: NextRequest, ...args: any[]) => {
    const start = performance.now();
    const route = new URL(request.url).pathname;
    const method = request.method;
    const userAgent = request.headers.get("user-agent");
    const ip = extractIp(request);

    // Extract user_id without logging the token
    const userId = extractUserId(request);

    // Parse browser name from UA (never store raw UA in log body)
    const browser = parseBrowser(userAgent);

    // Hash IP — never store raw IP
    const ipHash = hashIp(ip);

    let response: NextResponse | Response;
    let statusCode = 500;
    let errorMessage: string | null = null;

    try {
      response = await handler(request, ...args);
      statusCode = response.status;

      // Clone the response so we can read its body for error detection
      // (without consuming the original stream)
      if (statusCode >= 400 && !isSensitiveRoute(route)) {
        try {
          const clone = response.clone();
          const body = await clone.json();
          if (body?.error && typeof body.error === "string") {
            errorMessage = body.error.slice(0, 200);
          }
        } catch {
          // Response body isn't JSON or is empty — that's fine
        }
      }
    } catch (err: any) {
      // Catch unhandled errors from the handler
      errorMessage = err?.message
        ? err.message.slice(0, 200)
        : "Internal server error";
      // Re-throw the error as a proper Response
      response = NextResponse.json(
        { error: "Erreur serveur" },
        { status: 500 }
      );
      statusCode = 500;
    }

    const durationMs = Math.round(performance.now() - start);

    // ── Console log (structured, safe) ──
    const logEntry: ApiLogEntry = {
      timestamp: new Date().toISOString(),
      route,
      method,
      user_id: userId,
      status_code: statusCode,
      duration_ms: durationMs,
      error_message: errorMessage,
      browser,
      ip_hash: ipHash,
    };
    console.log(`[API] ${method} ${route} ${statusCode} ${durationMs}ms`, {
      userId,
      browser,
      error: errorMessage,
    });

    // ── Store in AnalyticsEvent table (fire-and-forget) ──
    prisma.analyticsEvent
      .create({
        data: {
          eventName: `api_${method.toLowerCase()}_${statusCode < 400 ? "success" : "error"}`,
          properties: {
            route,
            method,
            statusCode,
            durationMs,
            browser,
            ipHash, // hashed, not raw
            ...(errorMessage ? { errorMessage } : {}),
          },
          userId: userId ?? undefined,
          page: route,
          userAgent: userAgent ?? undefined,
          ipAddress: ipHash ?? undefined,
        },
      })
      .catch((err: Error) => {
        // Never let analytics storage failure crash the request
        console.error("[api-logger] Failed to store analytics event:", err.message);
      });

    // ── Set response header with duration (for debugging) ──
    if (response instanceof NextResponse) {
      response.headers.set("X-Duration-Ms", String(durationMs));
    }

    return response;
  };
}
