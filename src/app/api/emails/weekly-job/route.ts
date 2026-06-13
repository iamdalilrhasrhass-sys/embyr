import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const users = await prisma.user.findMany({
      where: { email: { not: '' } },
      select: { id: true },
      take: 50,
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://embir.xyz';

    let sent = 0;
    for (const user of users) {
      try {
        await fetch(`${appUrl}/api/emails/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'weekly-digest',
            userId: user.id,
            data: { newMatches: 0, topArticles: [] },
          }),
        });
        sent++;
      } catch {}
    }

    return NextResponse.json({ success: true, usersNotified: sent });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
