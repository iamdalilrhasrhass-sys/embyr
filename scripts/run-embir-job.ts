#!/usr/bin/env node
import { closeJobResources, runScheduledJob } from "../src/lib/job-runner.ts";
import { isJobCadence } from "../src/lib/job-schedule.ts";
import { prisma } from "../src/lib/prisma.ts";
import { sanitizeOperationalError } from "../src/lib/email-core.ts";

async function main(): Promise<void> {
  const cadence = process.argv[2];
  if (!isJobCadence(cadence)) {
    console.error("Usage: run-embir-job.ts <hourly|daily|weekly> [--at ISO_DATE]");
    process.exitCode = 2;
    return;
  }

  const atIndex = process.argv.indexOf("--at");
  const requestedAt = atIndex >= 0 ? process.argv[atIndex + 1] : undefined;
  const now = requestedAt ? new Date(requestedAt) : new Date();
  if (Number.isNaN(now.getTime())) {
    console.error("--at must be a valid ISO date");
    process.exitCode = 2;
    return;
  }

  try {
    const result = await runScheduledJob(cadence, now);
    console.log(JSON.stringify(result));
    if (result.status === "failed") process.exitCode = 1;
  } catch (error) {
    console.error(
      "Scheduled job failed before it could be recorded:",
      sanitizeOperationalError(error),
    );
    process.exitCode = 1;
  } finally {
    await closeJobResources();
    await prisma.$disconnect();
  }
}

void main();
