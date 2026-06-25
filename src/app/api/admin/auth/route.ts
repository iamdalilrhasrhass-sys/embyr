import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, createAdminSessionToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const password = formData.get("password") as string;

  if (!password) {
    return NextResponse.redirect(new URL("/analytics-dashboard?error=1", req.url));
  }

  if (verifyAdminPassword(password)) {
    const sessionToken = createAdminSessionToken();
    const response = NextResponse.redirect(new URL("/analytics-dashboard", req.url));
    response.cookies.set("embir_admin_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });
    return response;
  }

  return NextResponse.redirect(new URL("/analytics-dashboard?error=1", req.url));
}
