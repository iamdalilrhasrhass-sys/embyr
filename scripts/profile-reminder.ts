#!/usr/bin/env node

// Compatibility wrapper for the former profile-reminder cron. User lifecycle
// emails are no longer sent through an unauthenticated HTTP route. The daily
// runner owns idempotence, aggregate reporting and outbox processing.
import { closeJobResources, runScheduledJob } from "../src/lib/job-runner.ts";
import { prisma } from "../src/lib/prisma.ts";

try {
  const result = await runScheduledJob("daily");
  console.log(JSON.stringify(result));
  if (result.status === "failed") process.exitCode = 1;
} finally {
  await closeJobResources();
  await prisma.$disconnect();
}
