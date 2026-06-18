import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const password = formData.get("password") as string;
  const secret = process.env.ADMIN_SECRET || "embir_dashboard_2026";

  if (password === secret) {
    const cookieStore = await cookies();
    cookieStore.set("embir_admin_token", secret, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });
    return NextResponse.redirect(new URL("/analytics-dashboard", req.url));
  }

  return NextResponse.redirect(new URL("/analytics-dashboard?error=1", req.url));
}
