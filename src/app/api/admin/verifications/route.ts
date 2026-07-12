import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });

  const requests = await prisma.photoVerification.findMany({
    where: { status: "pending", photoPath: { not: "" } },
    orderBy: { submittedAt: "asc" },
    take: 100,
    select: { id: true, userId: true, code: true, status: true, submittedAt: true },
  });
  const users = await prisma.user.findMany({
    where: { id: { in: requests.map((request) => request.userId) }, bannedAt: null, deletedAt: null },
    select: { id: true, profile: { select: { username: true, displayName: true } } },
  });
  const usersById = new Map(users.map((user) => [user.id, user]));

  return NextResponse.json(
    requests.flatMap((request) => {
      const user = usersById.get(request.userId);
      return user
        ? [{
            id: request.id,
            userId: request.userId,
            code: request.code,
            status: request.status,
            submittedAt: request.submittedAt,
            profile: user.profile,
            photoUrl: `/api/admin/verifications/${request.id}/photo`,
          }]
        : [];
    }),
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Accès administrateur requis" }, { status: 401 });
  const body = await request.json().catch(() => null) as {
    id?: unknown;
    decision?: unknown;
    reason?: unknown;
  } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  const decision = body?.decision;
  const reason = typeof body?.reason === "string" ? body.reason.trim().slice(0, 500) : "";
  if (!id || id.length > 64 || (decision !== "approve" && decision !== "reject")) {
    return NextResponse.json({ error: "Décision invalide" }, { status: 400 });
  }
  if (decision === "reject" && reason.length < 3) {
    return NextResponse.json({ error: "Un motif de rejet est requis" }, { status: 400 });
  }

  const verification = await prisma.photoVerification.findFirst({
    where: { id, status: "pending", photoPath: { not: "" } },
    select: { id: true, userId: true },
  });
  if (!verification) return NextResponse.json({ error: "Demande introuvable" }, { status: 404 });

  const approved = decision === "approve";
  const reviewedAt = new Date();
  await prisma.$transaction([
    prisma.photoVerification.update({
      where: { id: verification.id },
      data: {
        status: approved ? "approved" : "rejected",
        reviewedAt,
        reviewedBy: admin.userId ?? "admin_session",
        rejectionReason: approved ? null : reason,
        deletionScheduledAt: new Date(reviewedAt.getTime() + 30 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.profile.update({
      where: { userId: verification.userId },
      data: {
        isVerified: approved,
        verificationStatus: approved ? "verified" : "rejected",
      },
    }),
  ]);

  await createNotification({
    userId: verification.userId,
    type: "verification",
    title: approved ? "Profil vérifié" : "Vérification à reprendre",
    body: approved ? "Ta vérification a été validée." : "Ta vérification n'a pas été validée. Consulte le motif et réessaie.",
    link: "/verification",
    dedupeKey: `photo-verification:${verification.id}:${decision}`,
  }).catch(() => undefined);

  return NextResponse.json({ success: true, status: approved ? "approved" : "rejected" });
}
