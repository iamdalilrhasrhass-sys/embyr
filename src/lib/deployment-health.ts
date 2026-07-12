import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { prisma } from "./prisma.ts";

export interface BackupHealth {
  status: "ok" | "stale" | "missing" | "unconfigured";
  completedAt: string | null;
  file: string | null;
  bytes: number | null;
}

export interface MigrationHealth {
  status: "ok" | "missing";
  name: string | null;
  finishedAt: string | null;
}

type MigrationRow = { migration_name: string; finished_at: Date | null };

export async function getBackupHealth(now = new Date()): Promise<BackupHealth> {
  const configuredPath = process.env.EMBIR_BACKUP_STATUS_FILE?.trim();
  const statusPath = configuredPath || (process.env.NODE_ENV === "production"
    ? "/root/embir-backups/database/last-success.json"
    : "");
  if (!statusPath) return { status: "unconfigured", completedAt: null, file: null, bytes: null };

  try {
    const parsed = JSON.parse(await readFile(statusPath, "utf8")) as Record<string, unknown>;
    if (
      parsed.schemaVersion !== 1 ||
      parsed.verified !== true ||
      typeof parsed.completedAt !== "string" ||
      typeof parsed.file !== "string" ||
      typeof parsed.bytes !== "number" ||
      parsed.bytes <= 0
    ) {
      return { status: "missing", completedAt: null, file: null, bytes: null };
    }
    const completedAt = new Date(parsed.completedAt);
    if (Number.isNaN(completedAt.getTime()) || completedAt > new Date(now.getTime() + 5 * 60_000)) {
      return { status: "missing", completedAt: null, file: null, bytes: null };
    }
    const ageHours = (now.getTime() - completedAt.getTime()) / (60 * 60 * 1000);
    return {
      status: ageHours <= 36 ? "ok" : "stale",
      completedAt: completedAt.toISOString(),
      file: basename(parsed.file),
      bytes: parsed.bytes,
    };
  } catch {
    return { status: "missing", completedAt: null, file: null, bytes: null };
  }
}

export async function getMigrationHealth(): Promise<MigrationHealth> {
  try {
    const rows = await prisma.$queryRaw<MigrationRow[]>`
      SELECT migration_name, finished_at
      FROM "_prisma_migrations"
      WHERE rolled_back_at IS NULL AND finished_at IS NOT NULL
      ORDER BY finished_at DESC
      LIMIT 1
    `;
    const latest = rows[0];
    if (!latest?.finished_at) return { status: "missing", name: null, finishedAt: null };
    return {
      status: "ok",
      name: latest.migration_name,
      finishedAt: latest.finished_at.toISOString(),
    };
  } catch {
    return { status: "missing", name: null, finishedAt: null };
  }
}
