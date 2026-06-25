import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const protectedAdminRoutes = [
  "src/app/api/admin/acquisition/route.ts",
  "src/app/api/admin/action/route.ts",
  "src/app/api/admin/ambassadors/action/route.ts",
  "src/app/api/admin/ambassadors/route.ts",
  "src/app/api/admin/notify-signup/route.ts",
  "src/app/api/admin/prospects/route.ts",
  "src/app/api/admin/reports/route.ts",
  "src/app/api/admin/users/route.ts",
];

test("admin authentication never stores or falls back to the raw secret", async () => {
  const source = await readFile("src/app/api/admin/auth/route.ts", "utf8");

  assert.doesNotMatch(source, /process\.env\.ADMIN_SECRET\s*\|\|/);
  assert.match(source, /createAdminSessionToken/);
  assert.match(source, /verifyAdminPassword/);
});

test("every admin data route uses the shared authorization gate", async () => {
  for (const route of protectedAdminRoutes) {
    const source = await readFile(route, "utf8");
    assert.match(source, /requireAdmin/, `${route} must call requireAdmin`);
  }
});

test("the analytics dashboard validates a signed admin session", async () => {
  const source = await readFile(
    "src/app/[locale]/analytics-dashboard/page.tsx",
    "utf8",
  );

  assert.match(source, /verifyAdminSessionToken/);
  assert.doesNotMatch(source, /process\.env\.ADMIN_SECRET\s*\|\|/);
});
