import { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sanitizeOperationalError } from "@/lib/email-core";
import { enqueueEmailVerification } from "@/lib/email-verification-delivery";
import { processEmailOutbox } from "@/lib/email-outbox";
import { withApiLogging } from "@/lib/api-logger";
import { prisma } from "@/lib/prisma";
import { consumePublicForm } from "@/lib/public-form-rate-limit";

async function handlePost(request: NextRequest) {
  const rateLimit = consumePublicForm(request, "email-verification-resend", 4);
  if (!rateLimit.allowed) {
    return Response.json(
      { success: false, code: "rate_limited" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds) } },
    );
  }

  const auth = await getCurrentUser();
  if (!auth) return Response.json({ success: false, code: "unauthorized" }, { status: 401 });

  try {
    const user = await prisma.user.findFirst({
      where: { id: auth.id, deletedAt: null, bannedAt: null },
      select: { id: true, email: true, emailVerified: true, profile: { select: { language: true } } },
    });
    if (!user) return Response.json({ success: false, code: "unauthorized" }, { status: 401 });
    if (user.emailVerified) return Response.json({ success: true, alreadyVerified: true });

    const queued = await enqueueEmailVerification({
      userId: user.id,
      email: user.email,
      locale: user.profile?.language,
    });
    const delivery = await processEmailOutbox({ limit: 20 });
    return Response.json(
      {
        success: true,
        queued: queued.queued || queued.deduplicated,
        deliveryAttempted: delivery.claimed > 0,
      },
      { status: 202, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    console.error("[email-verification] resend failed", sanitizeOperationalError(error));
    return Response.json({ success: false, code: "resend_failed" }, { status: 500 });
  }
}

export const POST = withApiLogging(handlePost);
