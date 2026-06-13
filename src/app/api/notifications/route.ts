import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id');
  if (!userId || userId === 'session') {
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }

  const [notifications, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.notification.count({ where: { userId, read: false } }),
  ]);

  return NextResponse.json({ notifications, unreadCount });
}

export async function PATCH(req: NextRequest) {
  const { notificationId } = await req.json();
  await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
  return NextResponse.json({ ok: true });
}
