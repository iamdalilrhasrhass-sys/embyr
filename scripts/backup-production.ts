import { spawnSync } from "node:child_process";
import {
  chmodSync,
  mkdirSync,
  readdirSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join } from "node:path";

const databaseUrl = process.env.DATABASE_URL?.trim();
if (!databaseUrl) throw new Error("DATABASE_URL must be configured");

const parsed = new URL(databaseUrl);
if (parsed.protocol !== "postgresql:" && parsed.protocol !== "postgres:") {
  throw new Error("DATABASE_URL must use PostgreSQL");
}

const database = decodeURIComponent(parsed.pathname.replace(/^\//, ""));
const username = decodeURIComponent(parsed.username);
const password = decodeURIComponent(parsed.password);
if (!database || !username) throw new Error("DATABASE_URL is incomplete");

const backupDirectory = process.env.EMBIR_BACKUP_DIR?.trim() || "/root/embir-backups/database";
const retentionDays = Math.min(90, Math.max(7, Number(process.env.EMBIR_BACKUP_RETENTION_DAYS ?? 30) || 30));
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const finalPath = join(backupDirectory, `${timestamp}_embir.dump`);
const partialPath = `${finalPath}.partial`;
const statusPath = join(backupDirectory, "last-success.json");
const statusPartialPath = `${statusPath}.partial`;

mkdirSync(backupDirectory, { recursive: true, mode: 0o700 });
chmodSync(backupDirectory, 0o700);

const childEnvironment = { ...process.env, PGPASSWORD: password };
delete childEnvironment.DATABASE_URL;
const sslMode = parsed.searchParams.get("sslmode");
if (sslMode) childEnvironment.PGSSLMODE = sslMode;

const connectionArguments = [
  "--host", parsed.hostname || "127.0.0.1",
  "--port", parsed.port || "5432",
  "--username", username,
  "--dbname", database,
];

function run(binary: string, args: string[]): void {
  const result = spawnSync(binary, args, {
    env: childEnvironment,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    timeout: 15 * 60 * 1000,
  });
  if (result.error) throw new Error(`${binary} could not start`);
  if (result.status !== 0) throw new Error(`${binary} failed with status ${result.status ?? "unknown"}`);
}

try {
  run("pg_dump", [
    ...connectionArguments,
    "--format=custom",
    "--no-owner",
    "--no-acl",
    "--file", partialPath,
  ]);
  const backupStat = statSync(partialPath);
  if (!backupStat.isFile() || backupStat.size === 0) throw new Error("Database backup is empty");
  run("pg_restore", ["--list", partialPath]);
  chmodSync(partialPath, 0o600);
  renameSync(partialPath, finalPath);

  const completedAt = new Date().toISOString();
  writeFileSync(statusPartialPath, `${JSON.stringify({
    schemaVersion: 1,
    completedAt,
    file: basename(finalPath),
    bytes: backupStat.size,
    verified: true,
  })}\n`, { mode: 0o600 });
  chmodSync(statusPartialPath, 0o600);
  renameSync(statusPartialPath, statusPath);

  const cutoff = Date.now() - retentionDays * 24 * 60 * 60 * 1000;
  for (const entry of readdirSync(backupDirectory)) {
    if (!entry.endsWith("_embir.dump") || entry === basename(finalPath)) continue;
    const candidate = join(backupDirectory, entry);
    if (statSync(candidate).mtimeMs < cutoff) rmSync(candidate, { force: true });
  }

  process.stdout.write(JSON.stringify({ status: "succeeded", completedAt, bytes: backupStat.size }) + "\n");
} catch (error) {
  rmSync(partialPath, { force: true });
  rmSync(statusPartialPath, { force: true });
  const message = error instanceof Error ? error.message : "backup failed";
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}
