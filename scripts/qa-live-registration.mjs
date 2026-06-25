import assert from "node:assert/strict";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });
const baseUrl = process.env.QA_BASE_URL || "http://127.0.0.1:3100";
const runId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const emails = [1, 2, 3].map(
  (index) => `embir-qa-${runId}-${index}@example.com`,
);
const results = [];

try {
  for (const email of emails) {
    const startedAt = performance.now();
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email,
        password: `Embir-QA-${runId}!`,
        isAdult: true,
        acceptTerms: true,
      }),
    });
    const latencyMs = Math.round(performance.now() - startedAt);
    const payload = await response.json();

    results.push({
      email,
      status: response.status,
      latencyMs,
      userId: payload.user?.id ?? null,
    });
    assert.equal(response.status, 201, `registration failed for ${email}`);
    assert.ok(payload.user?.id, `registration returned no user id for ${email}`);
  }

  const users = await prisma.user.findMany({
    where: { email: { in: emails } },
    select: {
      id: true,
      email: true,
      role: true,
      isAdultConfirmed: true,
      consentSensitiveData: true,
      profile: {
        select: {
          isPremium: true,
          isFounder: true,
          premiumUntil: true,
          profileSource: true,
        },
      },
      ambassador: { select: { id: true } },
      consents: { select: { type: true } },
    },
    orderBy: { email: "asc" },
  });

  assert.equal(users.length, 3, "all three QA users must exist in the database");
  for (const user of users) {
    assert.equal(user.role, "USER");
    assert.equal(user.isAdultConfirmed, true);
    assert.equal(user.consentSensitiveData, false);
    assert.equal(user.profile?.isPremium, false);
    assert.equal(user.profile?.isFounder, false);
    assert.equal(user.profile?.premiumUntil, null);
    assert.equal(user.profile?.profileSource, "user_registration");
    assert.equal(user.ambassador, null);
    assert.deepEqual(
      user.consents.map(({ type }) => type).sort(),
      ["cgu", "privacy"],
    );
  }

  console.log(
    JSON.stringify(
      {
        registrations: results.map(({ email, status, latencyMs }) => ({
          email,
          status,
          latencyMs,
        })),
        databaseChecks: users.map((user) => ({
          email: user.email,
          role: user.role,
          isAdultConfirmed: user.isAdultConfirmed,
          isPremium: user.profile?.isPremium,
          isFounder: user.profile?.isFounder,
          ambassador: Boolean(user.ambassador),
          consents: user.consents.map(({ type }) => type).sort(),
        })),
      },
      null,
      2,
    ),
  );
} finally {
  await prisma.user.deleteMany({ where: { email: { in: emails } } });
  const remaining = await prisma.user.count({
    where: { email: { in: emails } },
  });
  console.log(`QA REGISTRATION CLEANUP: ${remaining === 0 ? "PASS" : "FAIL"}`);
  await prisma.$disconnect();
  await pool.end();
}
