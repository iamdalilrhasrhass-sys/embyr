import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// ── Types ──

export type ApiHandler<TArgs extends unknown[] = unknown[]> = (
  request: NextRequest,
  ...args: TArgs
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
  device_category: "bot" | "mobile" | "tablet" | "desktop" | "unknown";
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

function deviceCategory(ua: string | null): ApiLogEntry["device_category"] {
  if (!ua) return "unknown";
  if (/bot|crawler|spider|slurp|headless/i.test(ua)) return "bot";
  if (/ipad|tablet|kindle/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android/i.test(ua)) return "mobile";
  return "desktop";
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
export function withApiLogging<TArgs extends unknown[]>(
  handler: ApiHandler<TArgs>,
): ApiHandler<TArgs> {
  return async (request: NextRequest, ...args: TArgs) => {
    const start = performance.now();
    const route = new URL(request.url).pathname;
    const method = request.method;
    const userAgent = request.headers.get("user-agent");

    // Extract user_id without logging the token
    const userId = extractUserId(request);

    // Parse browser name from UA (never store raw UA in log body)
    const browser = parseBrowser(userAgent);

    const coarseDevice = deviceCategory(userAgent);

    let response: NextResponse | Response;
    let statusCode = 500;
    let errorMessage: string | null = null;

    try {
      response = await handler(request, ...args);
      statusCode = response.status;

      if (statusCode >= 400 && !isSensitiveRoute(route)) errorMessage = "request_failed";
    } catch {
      // Catch unhandled errors from the handler
      errorMessage = "internal_error";
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
      device_category: coarseDevice,
    };
    console.log(`[API] ${method} ${route} ${statusCode} ${durationMs}ms`, logEntry);

    // ── Store in AnalyticsEvent table (fire-and-forget) ──
    prisma.analyticsEvent
      .create({
        data: {
          eventId: randomUUID(),
          eventName: "api_request",
          eventVersion: 1,
          occurredAt: new Date(),
          properties: {
            route,
            method,
            statusCode,
            durationMs,
            browser,
            outcome: statusCode < 400 ? "success" : "error",
          },
          userId: userId ?? undefined,
          page: route,
          deviceCategory: coarseDevice,
          userAgent: null,
          ipAddress: null,
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
