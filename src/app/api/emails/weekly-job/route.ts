import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { runScheduledJob } from "@/lib/job-runner";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { error: "Utilisez POST avec une session administrateur authentifiée" },
    { status: 405, headers: { Allow: "POST" } },
  );
}

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Accès administrateur requis" },
      { status: 401 },
    );
  }

  const result = await runScheduledJob("weekly");
  const status = result.status === "failed" ? 500 : 200;
  return NextResponse.json(result, { status });
}
