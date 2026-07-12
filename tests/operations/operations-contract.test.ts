import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("email routes are protected and enqueue instead of sending directly", async () => {
  const sendRoute = await readFile("src/app/api/emails/send/route.ts", "utf8");
  const weeklyRoute = await readFile(
    "src/app/api/emails/weekly-job/route.ts",
    "utf8",
  );
  assert.match(sendRoute, /requireAdmin/);
  assert.match(sendRoute, /enqueueUserEmail/);
  assert.doesNotMatch(sendRoute, /sendEmail\(/);
  assert.match(weeklyRoute, /requireAdmin/);
  assert.match(weeklyRoute, /status:\s*405/);
  assert.match(weeklyRoute, /runScheduledJob\("weekly"\)/);
});

test("outbox uses database idempotence and leases", async () => {
  const source = await readFile("src/lib/email-outbox.ts", "utf8");
  const smtp = await readFile("src/lib/email-local.ts", "utf8");
  assert.match(source, /ON CONFLICT \("dedupeKey"\) DO NOTHING/);
  assert.match(source, /FOR UPDATE SKIP LOCKED/);
  assert.match(source, /recipientHash/);
  assert.match(smtp, /function getTransporter/);
  assert.doesNotMatch(smtp, /SMTP_(?:HOST|FROM|USER|PASS)\s*\|\|/);
  assert.doesNotMatch(smtp, /noreply@embir\.xyz/);
});

test("scheduled jobs use JobRun idempotence and PostgreSQL advisory locks", async () => {
  const source = await readFile("src/lib/job-runner.ts", "utf8");
  assert.match(source, /pg_try_advisory_lock/);
  assert.match(source, /pg_advisory_unlock/);
  assert.match(source, /ON CONFLICT \("idempotencyKey"\) DO NOTHING/);
  assert.match(source, /"JobRun"/);
  assert.match(source, /partialFailures/);
  assert.match(source, /"metadata" = CAST/);
});

test("maintenance records expirations and elapsed confirmed plans idempotently", async () => {
  const source = await readFile("src/lib/job-maintenance.ts", "utf8");
  assert.match(source, /signal-expired:\$\{signal\.id\}/);
  assert.match(source, /eventName:\s*"signal_expired"/);
  assert.match(source, /skipDuplicates:\s*true/);
  assert.match(source, /connection\."state" = 'PLAN_CONFIRMED'/);
  assert.match(source, /"state" = 'MET'/);
  assert.match(source, /fromState:\s*"PLAN_CONFIRMED"/);
  assert.match(source, /toState:\s*"MET"/);
  assert.doesNotMatch(source, /createNotification|Notification".*MET/s);
});

test("daily aggregation is durable before bounded raw analytics retention", async () => {
  const runner = await readFile("src/lib/job-runner.ts", "utf8");
  const maintenance = await readFile("src/lib/job-maintenance.ts", "utf8");
  const dailySection = runner.slice(runner.indexOf('if (cadence === "daily")'));
  assert.ok(
    dailySection.indexOf("persistDailyAggregate") <
      dailySection.indexOf("retainRawAnalytics"),
  );
  assert.match(maintenance, /JOIN "DailyAggregate" aggregate/);
  assert.match(maintenance, /MAX_RETENTION_DELETE_ROWS = 50_000/);
  assert.match(maintenance, /ANALYTICS_RETENTION_DAYS = 90/);
  assert.match(maintenance, /unaggregatedDaysRemaining/);
});

test("cleanup is bounded and email preferences defer or skip delivery safely", async () => {
  const maintenance = await readFile("src/lib/job-maintenance.ts", "utf8");
  const outbox = await readFile("src/lib/email-outbox.ts", "utf8");
  assert.match(maintenance, /MAX_CLEANUP_ROWS = 10_000/);
  assert.match(maintenance, /"payload" = CAST\('\{"redacted":true\}' AS jsonb\)/);
  assert.match(maintenance, /"read" = TRUE/);
  assert.match(maintenance, /"deliveryStatus" = 'SKIPPED'/);
  assert.match(outbox, /np\."emailEnabled"/);
  assert.match(outbox, /quietHoursEnabled/);
  assert.match(outbox, /deferForQuietHours/);
  assert.match(outbox, /user_email_preference_disabled/);
});

test("package exposes operational commands", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"));
  assert.ok(packageJson.scripts["job:hourly"]);
  assert.ok(packageJson.scripts["job:daily"]);
  assert.ok(packageJson.scripts["job:weekly"]);
  assert.ok(packageJson.scripts["backup:production"]);
  assert.ok(packageJson.scripts["feature-flag:evaluate"]);
  assert.ok(packageJson.scripts["test:operations"]);
  for (const script of Object.values(packageJson.scripts) as string[]) {
    assert.doesNotMatch(script, /--experimental-strip-types/);
  }
});
