import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { notificationDtoSelect } from '@/lib/notifications';
import { prisma } from '@/lib/prisma';

function unauthorized() {
  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const limitParam = Number(req.nextUrl.searchParams.get('limit') ?? 30);
  const limit = Number.isInteger(limitParam) ? Math.min(Math.max(limitParam, 1), 50) : 30;
  const cursor = req.nextUrl.searchParams.get('cursor') || undefined;

  const preferences = await prisma.notificationPreference.findUnique({
    where: { userId: user.id },
    select: { inAppEnabled: true },
  });
  if (preferences?.inAppEnabled === false) {
    await prisma.notification.updateMany({
      where: { userId: user.id, deliveryStatus: 'PENDING' },
      data: { deliveryStatus: 'SKIPPED' },
    });
  }

  const [rows, unreadCount] = await Promise.all([
    prisma.notification.findMany({
      where: { userId: user.id, deliveryStatus: { not: 'SKIPPED' } },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: limit + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: { ...notificationDtoSelect, deliveryStatus: true },
    }),
    prisma.notification.count({
      where: { userId: user.id, read: false, deliveryStatus: { not: 'SKIPPED' } },
    }),
  ]);

  const hasMore = rows.length > limit;
  const pageRows = hasMore ? rows.slice(0, limit) : rows;
  const pendingRows = pageRows.filter((notification) => notification.deliveryStatus === 'PENDING');
  const pendingIds = pendingRows.map((notification) => notification.id);
  if (pendingIds.length > 0) {
    await prisma.$transaction([
      prisma.notification.updateMany({
        where: {
          id: { in: pendingIds },
          userId: user.id,
          deliveryStatus: 'PENDING',
        },
        data: { deliveryStatus: 'SENT' },
      }),
      prisma.analyticsEvent.createMany({
        data: pendingRows.map((notification) => ({
            eventId: crypto.randomUUID(),
            eventName: 'notification_sent',
            eventVersion: 1,
            userId: user.id,
            occurredAt: new Date(),
            properties: { notificationType: notification.type },
          })),
      }),
    ]);
  }
  const notifications = pageRows.map(({ deliveryStatus: _deliveryStatus, ...notification }) => ({
    ...notification,
    link:
      notification.link?.startsWith('/') && !notification.link.startsWith('//')
        ? notification.link
        : null,
  }));
  return NextResponse.json(
    {
      notifications,
      unreadCount,
      nextCursor: hasMore ? notifications.at(-1)?.id ?? null : null,
    },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const action = 'action' in body ? body.action : undefined;
  if (action === 'read_all') {
    const result = await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data: { read: true, readAt: new Date() },
    });
    return NextResponse.json({ ok: true, updated: result.count });
  }

  const notificationId = 'notificationId' in body ? body.notificationId : undefined;
  if (action !== 'read' || typeof notificationId !== 'string' || notificationId.length > 64) {
    return NextResponse.json({ error: 'Action invalide' }, { status: 400 });
  }

  const result = await prisma.notification.updateMany({
    where: { id: notificationId, userId: user.id, read: false },
    data: { read: true, readAt: new Date() },
  });
  if (result.count === 0) {
    const owned = await prisma.notification.count({ where: { id: notificationId, userId: user.id } });
    if (owned === 0) return NextResponse.json({ error: 'Notification introuvable' }, { status: 404 });
  }

  if (result.count > 0) {
    const notification = await prisma.notification.findFirst({
      where: { id: notificationId, userId: user.id },
      select: { type: true },
    });
    await prisma.analyticsEvent.create({
      data: {
        eventId: crypto.randomUUID(),
        eventName: 'notification_opened',
        eventVersion: 1,
        userId: user.id,
        occurredAt: new Date(),
        properties: { notificationType: notification?.type ?? 'system' },
      },
    });
  }

  return NextResponse.json({ ok: true, updated: result.count });
}
