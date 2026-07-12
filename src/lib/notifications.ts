import { prisma } from '@/lib/prisma';

export const NOTIFICATION_TYPES = [
  'contextual_signal',
  'resonance',
  'reciprocal_connection',
  'reveal_request',
  'reveal_response',
  'reveal_completed',
  'new_message',
  'meeting_proposal',
  'meeting_confirmed',
  'plan_proposed',
  'connection_paused',
  'connection_closed',
  'verification',
  'system',
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface NotificationDto {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  readAt: Date | null;
  link: string | null;
  createdAt: Date;
}

interface CreateNotificationInput {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link?: string;
  dedupeKey: string;
}

export const notificationDtoSelect = {
  id: true,
  type: true,
  title: true,
  body: true,
  read: true,
  readAt: true,
  link: true,
  createdAt: true,
} as const;

function boundedText(value: string, maxLength: number, field: string): string {
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if (!cleaned || cleaned.length > maxLength) throw new Error(`invalid_notification_${field}`);
  return cleaned;
}

function localLink(value: string | undefined): string | undefined {
  if (!value) return undefined;
  if (!value.startsWith('/') || value.startsWith('//') || value.length > 300) {
    throw new Error('invalid_notification_link');
  }
  return value.split(/[?#]/, 1)[0];
}

/**
 * Creates an in-app notification once for a semantic event. The key is always
 * namespaced by recipient, so callers cannot accidentally deduplicate users
 * against each other.
 */
export async function createNotification(
  input: CreateNotificationInput,
): Promise<NotificationDto> {
  const title = boundedText(input.title, 120, 'title');
  const body = boundedText(input.body, 500, 'body');
  const link = localLink(input.link);
  const semanticKey = boundedText(input.dedupeKey, 160, 'dedupe_key');
  const dedupeKey = `${input.userId}:${semanticKey}`;

  const preferences = await prisma.notificationPreference.findUnique({
    where: { userId: input.userId },
    select: { inAppEnabled: true },
  });
  const deliveryStatus = preferences?.inAppEnabled === false ? 'SKIPPED' : 'PENDING';

  return prisma.notification.upsert({
    where: { dedupeKey },
    create: {
      userId: input.userId,
      type: input.type,
      title,
      body,
      link,
      dedupeKey,
      deliveryStatus,
    },
    update: {},
    select: notificationDtoSelect,
  });
}
