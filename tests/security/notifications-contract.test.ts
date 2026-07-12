import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("notification reads and mutations derive ownership from the signed session", async () => {
  const route = await readFile("src/app/api/notifications/route.ts", "utf8");

  assert.match(route, /getCurrentUser/);
  assert.doesNotMatch(route, /x-user-id/);
  assert.match(route, /updateMany/);
  assert.match(route, /userId:\s*user\.id/);
  assert.match(route, /notificationDtoSelect/);
  assert.match(route, /Cache-Control.*private, no-store/s);
});

test("notification creation uses a recipient-scoped idempotency key", async () => {
  const helper = await readFile("src/lib/notifications.ts", "utf8");

  assert.match(helper, /prisma\.notification\.upsert/);
  assert.match(helper, /const dedupeKey = `\$\{input\.userId\}:\$\{semanticKey\}`/);
  assert.match(helper, /where:\s*\{ dedupeKey \}/);
  assert.match(helper, /notificationDtoSelect/);
});

test("the notification bell never trusts a client-supplied identity", async () => {
  const bell = await readFile("src/components/NotificationBell.tsx", "utf8");

  assert.doesNotMatch(bell, /x-user-id|['"]session['"]/);
  assert.match(bell, /href="\/notifications"/);
});
