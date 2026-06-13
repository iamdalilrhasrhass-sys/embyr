#!/usr/bin/env npx tsx
/**
 * Profile Completion Reminder — sends emails to users with incomplete profiles
 * Cron: 0 10 * * * cd /root/embir && npx tsx scripts/profile-reminder.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const users = await prisma.user.findMany({
    where: {
      email: { not: null },
      createdAt: { lte: twoDaysAgo },
    },
    select: { id: true, email: true },
    take: 20,
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://embir.xyz';
  let sent = 0;

  for (const user of users) {
    try {
      await fetch(`${appUrl}/api/emails/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'profile-reminder',
          userId: user.id,
          data: { completionPercent: 50 },
        }),
      });
      sent++;
    } catch {}
  }

  console.log(`[Profile Reminder] Sent ${sent} reminders`);
  await prisma.$disconnect();
  process.exit(0);
}

main();
