import { NextRequest } from "next/server";
import {
  emailMatchesVerificationPayload,
  verifyEmailVerificationToken,
} from "@/lib/email-verification";
import { sanitizeOperationalError } from "@/lib/email-core";
import { withApiLogging } from "@/lib/api-logger";
import { prisma } from "@/lib/prisma";
import { consumePublicForm } from "@/lib/public-form-rate-limit";

async function handlePost(request: NextRequest) {
  const rateLimit = consumePublicForm(request, "email-verification", 12);
  if (!rateLimit.allowed) {
    return Response.json(
      { success: false, code: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  try {
    const body = await request.json().catch(() => null) as { token?: unknown } | null;
    const token = typeof body?.token === "string" ? body.token : "";
    const payload = verifyEmailVerificationToken(token);
    if (!payload) {
      return Response.json({ success: false, code: "invalid_or_expired" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { id: payload.userId, deletedAt: null, bannedAt: null },
      select: { id: true, email: true, emailVerified: true },
    });
    if (!user || !emailMatchesVerificationPayload(user.email, payload)) {
      return Response.json({ success: false, code: "invalid_or_expired" }, { status: 400 });
    }
    if (user.emailVerified) {
      return Response.json({ success: true, alreadyVerified: true });
    }

    const verifiedAt = new Date();
    await prisma.$transaction(async (tx) => {
      const changed = await tx.user.updateMany({
        where: {
          id: user.id,
          emailVerified: false,
          deletedAt: null,
          bannedAt: null,
        },
        data: { emailVerified: true, emailToken: null },
      });
      if (changed.count === 1) {
        await tx.analyticsEvent.create({
          data: {
            eventId: `email-verified:${user.id}`,
            eventName: "email_verified",
            eventVersion: 1,
            userId: user.id,
            occurredAt: verifiedAt,
            properties: {},
          },
        });
      }
    });

    return Response.json(
      { success: true, verifiedAt: verifiedAt.toISOString() },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[email-verification] verify failed", sanitizeOperationalError(error));
    return Response.json({ success: false, code: "verification_failed" }, { status: 500 });
  }
}

export const POST = withApiLogging(handlePost);
