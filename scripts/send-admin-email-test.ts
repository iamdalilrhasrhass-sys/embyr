import { adminSignupEmail } from "../src/emails/templates.ts";
import {
  adminSignupSubject,
  hashEmailAddress,
} from "../src/lib/email-core.ts";
import { collectAdminSignupMetrics } from "../src/lib/admin-signup-metrics.ts";
import {
  closeSmtpTransport,
  getRequiredAdminReportEmail,
  sendEmail,
} from "../src/lib/email-local.ts";
import { prisma } from "../src/lib/prisma.ts";

function releaseIdentifier(): string {
  const value = process.env.EMBIR_RELEASE_SHA?.trim().toLowerCase();
  if (!value || !/^[a-z0-9._-]{7,80}$/.test(value)) {
    throw new Error("EMBIR_RELEASE_SHA must identify the deployed release");
  }
  return value;
}

async function main(): Promise<void> {
  if (!process.argv.includes("--confirm-production-send")) {
    throw new Error("Pass --confirm-production-send to send the real validation email");
  }
  const release = releaseIdentifier();
  const now = new Date();
  const metrics = await collectAdminSignupMetrics({
    userId: "email-render-test",
    now,
  });
  const rendered = adminSignupEmail({
    occurredAt: now.toISOString(),
    country: "CH",
    language: "fr",
    source: "test opérationnel",
    campaign: "validation Gmail mobile",
    onboardingStatus: "started",
    totalUsers: metrics.totalUsers,
    qualifiedMembers: metrics.qualifiedMembers,
    growth24h: metrics.growth24h,
  });
  const recipient = getRequiredAdminReportEmail();
  const result = await sendEmail({
    to: recipient,
    subject: adminSignupSubject(metrics.totalUsers),
    html: rendered.html,
    text: rendered.text,
    dedupeKey: `admin-signup-render-test:${release}`,
  });
  console.log(JSON.stringify({
    sent: true,
    release,
    recipientHash: hashEmailAddress(recipient),
    providerMessageId: result.providerMessageId,
    totalUsers: metrics.totalUsers,
    occurredAt: now.toISOString(),
  }));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    closeSmtpTransport();
    await prisma.$disconnect();
  });
