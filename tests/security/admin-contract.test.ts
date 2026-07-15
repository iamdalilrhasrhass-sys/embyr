import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  clearAdminLoginAttempts,
  consumeAdminLoginAttempt,
} from "../../src/lib/admin-login-rate-limit.ts";

const protectedAdminRoutes = [
  "src/app/api/admin/acquisition/route.ts",
  "src/app/api/admin/action/route.ts",
  "src/app/api/admin/ambassadors/action/route.ts",
  "src/app/api/admin/ambassadors/route.ts",
  "src/app/api/admin/notify-signup/route.ts",
  "src/app/api/admin/prospects/route.ts",
  "src/app/api/admin/reports/route.ts",
  "src/app/api/admin/users/route.ts",
  "src/app/api/admin/verifications/route.ts",
];

test("admin authentication never stores or falls back to the raw secret", async () => {
  const source = await readFile("src/app/api/admin/auth/route.ts", "utf8");

  assert.doesNotMatch(source, /process\.env\.ADMIN_SECRET\s*\|\|/);
  assert.match(source, /createAdminSessionToken/);
  assert.match(source, /verifyAdminPassword/);
  assert.match(source, /process\.env\.FRONTEND_URL/);
  assert.match(source, /process\.env\.NEXT_PUBLIC_BASE_URL/);
  assert.doesNotMatch(source, /analytics-dashboard.*req\.url/);
  assert.match(source, /req\.headers\.get\("x-forwarded-host"\)/);
  assert.match(source, /new URL\(origin\)\.host !== publicHost\(req\)/);
});

test("admin login attempts are bounded in a fixed window", () => {
  const key = `test-${Date.now()}`;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    assert.equal(consumeAdminLoginAttempt(key, 1_000).allowed, true);
  }
  const rejected = consumeAdminLoginAttempt(key, 1_000);
  assert.equal(rejected.allowed, false);
  assert.equal(rejected.retryAfterSeconds, 900);
  clearAdminLoginAttempts(key);
});

test("every admin data route uses the shared authorization gate", async () => {
  for (const route of protectedAdminRoutes) {
    const source = await readFile(route, "utf8");
    assert.match(source, /requireAdmin/, `${route} must call requireAdmin`);
  }
});

test("all admin dashboards use the shared server-side authorization gate", async () => {
  const dashboards = [
    "src/app/[locale]/analytics-dashboard/page.tsx",
    "src/app/[locale]/admin/layout.tsx",
    "src/app/admin/analytics/page.tsx",
    "src/app/admin/feedback/page.tsx",
    "src/app/admin/partnerships/page.tsx",
  ];

  for (const dashboard of dashboards) {
    const source = await readFile(dashboard, "utf8");
    assert.match(source, /requireAdmin/, `${dashboard} must call requireAdmin`);
    assert.doesNotMatch(source, /process\.env\.ADMIN_SECRET\s*\|\|/);
  }
});

test("the admin cockpit is reachable through the localized application tree", async () => {
  const analytics = await readFile("src/app/[locale]/admin/analytics/page.tsx", "utf8");
  const feedback = await readFile("src/app/[locale]/admin/feedback/page.tsx", "utf8");
  const layout = await readFile("src/app/[locale]/admin/layout.tsx", "utf8");

  assert.match(analytics, /@\/app\/admin\/analytics\/page/);
  assert.match(feedback, /@\/app\/admin\/feedback\/page/);
  assert.match(layout, /requireAdmin/);
  assert.match(analytics, /robots:\s*\{\s*index:\s*false/);
  assert.match(feedback, /robots:\s*\{\s*index:\s*false/);
});

test("partnership CRM requires public contact provenance and permission state", async () => {
  const [schema, migration, route, page] = await Promise.all([
    readFile("prisma/schema.prisma", "utf8"),
    readFile("prisma/migrations/20260715020000_permission_first_partner_crm/migration.sql", "utf8"),
    readFile("src/app/api/admin/prospects/route.ts", "utf8"),
    readFile("src/app/admin/partnerships/page.tsx", "utf8"),
  ]);
  for (const source of [schema, migration, route]) {
    assert.match(source, /publicContact/);
    assert.match(source, /contactSourceUrl/);
    assert.match(source, /permissionStatus/);
    assert.match(source, /optedOutAt/);
  }
  assert.match(route, /requireAdmin/);
  assert.match(route, /permission_requested/);
  assert.match(route, /permission_granted/);
  assert.match(route, /requirePublicProvenance/);
  assert.match(route, /L’historique d’autorisation doit être conservé/);
  assert.match(page, /Contacts professionnels publics uniquement/);
  assert.match(page, /requireAdmin/);
});

test("admin user and report APIs return explicit DTO selections", async () => {
  for (const route of [
    "src/app/api/admin/users/route.ts",
    "src/app/api/admin/reports/route.ts",
    "src/app/api/admin/ambassadors/route.ts",
    "src/app/api/admin/prospects/route.ts",
  ]) {
    const source = await readFile(route, "utf8");
    assert.match(source, /select:/, `${route} must select an explicit DTO`);
    assert.doesNotMatch(source, /include:\s*\{\s*profile:\s*true/);
  }
});

test("feedback listing is admin-only while submission remains public", async () => {
  const source = await readFile("src/app/api/feedback/route.ts", "utf8");
  const getHandler = source.slice(source.indexOf("export async function GET"));

  assert.match(getHandler, /requireAdmin/);
  assert.match(getHandler, /select:/);
  assert.match(source, /userAgent:\s*null/);
});
