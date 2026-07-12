#!/usr/bin/env node
import { getServerFeatureFlag } from "../src/lib/feature-flags.ts";
import { prisma } from "../src/lib/prisma.ts";
import {
  isRuntimeEnvironment,
  resolveRuntimeEnvironment,
} from "../src/lib/runtime-environment.ts";

function argument(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main(): Promise<void> {
  const key = process.argv[2];
  if (!key) {
    console.error(
      "Usage: evaluate-feature-flag.ts <key> [--user-id ID] [--anonymous-id ID] [--city CITY] [--cohorts a,b] [--environment ENV]",
    );
    process.exitCode = 2;
    return;
  }

  const requestedEnvironment = argument("--environment");
  if (requestedEnvironment && !isRuntimeEnvironment(requestedEnvironment)) {
    console.error("Invalid --environment value");
    process.exitCode = 2;
    return;
  }

  try {
    const evaluation = await getServerFeatureFlag(key, {
      userId: argument("--user-id"),
      anonymousId: argument("--anonymous-id"),
      city: argument("--city"),
      cohorts: argument("--cohorts")
        ?.split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      environment: requestedEnvironment ?? resolveRuntimeEnvironment(),
    });
    console.log(
      JSON.stringify({
        enabled: evaluation.enabled,
        reason: evaluation.reason,
        bucket: evaluation.bucket,
        version: evaluation.version,
      }),
    );
  } finally {
    await prisma.$disconnect();
  }
}

void main();
