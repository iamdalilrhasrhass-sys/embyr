import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SITE_MAP: Record<string, { name: string; id: number }> = {
  "feminya.xyz": { name: "femynia", id: 1 },
  "www.feminya.xyz": { name: "femynia", id: 1 },
  "embir.xyz": { name: "embyr", id: 2 },
  "www.embir.xyz": { name: "embyr", id: 2 },
  "embyr.xyz": { name: "embyr", id: 2 },
  "www.embyr.xyz": { name: "embyr", id: 2 },
  "localhost:3000": { name: "femynia", id: 1 },
  "localhost:3100": { name: "embyr", id: 2 },
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const siteInfo = SITE_MAP[host] || { name: "embyr", id: 2 };

  const response = NextResponse.next();

  // Set x-site header for API routes
  response.headers.set("x-site", siteInfo.name);
  response.headers.set("x-site-id", String(siteInfo.id));

  // Set cookie for client-side theme detection
  response.cookies.set("site", siteInfo.name, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
