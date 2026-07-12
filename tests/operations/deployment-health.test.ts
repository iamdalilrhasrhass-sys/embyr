import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { getBackupHealth } from "../../src/lib/deployment-health.ts";

test("backup health accepts only verified, recent and non-empty manifests", async () => {
  const directory = await mkdtemp(join(tmpdir(), "embir-backup-health-"));
  const statusPath = join(directory, "last-success.json");
  const previous = process.env.EMBIR_BACKUP_STATUS_FILE;
  process.env.EMBIR_BACKUP_STATUS_FILE = statusPath;
  const now = new Date("2026-07-12T12:00:00.000Z");

  try {
    await writeFile(statusPath, JSON.stringify({
      schemaVersion: 1,
      completedAt: "2026-07-12T11:00:00.000Z",
      file: "2026-07-12_embir.dump",
      bytes: 1024,
      verified: true,
    }));
    assert.equal((await getBackupHealth(now)).status, "ok");

    await writeFile(statusPath, JSON.stringify({
      schemaVersion: 1,
      completedAt: "2026-07-10T00:00:00.000Z",
      file: "old.dump",
      bytes: 1024,
      verified: true,
    }));
    assert.equal((await getBackupHealth(now)).status, "stale");

    await writeFile(statusPath, JSON.stringify({
      schemaVersion: 1,
      completedAt: "2026-07-12T11:00:00.000Z",
      file: "empty.dump",
      bytes: 0,
      verified: true,
    }));
    assert.equal((await getBackupHealth(now)).status, "missing");
  } finally {
    if (previous === undefined) delete process.env.EMBIR_BACKUP_STATUS_FILE;
    else process.env.EMBIR_BACKUP_STATUS_FILE = previous;
    await rm(directory, { recursive: true, force: true });
  }
});

test("production backups keep database credentials out of child arguments", async () => {
  const source = await import("node:fs/promises").then(({ readFile }) =>
    readFile("scripts/backup-production.ts", "utf8"),
  );

  assert.match(source, /PGPASSWORD:\s*password/);
  assert.match(source, /delete childEnvironment\.DATABASE_URL/);
  assert.doesNotMatch(source, /--dbname[^\n]+databaseUrl/);
  assert.match(source, /pg_restore/);
  assert.match(source, /verified:\s*true/);
});
